import {useFetch} from '~/hooks/useFetch';
import {
  GET_TOTAL_STOCKCODE,
  PRODUCT_STOCK_CODE,
  PRODUCT_STOCK_CODE_INFO,
  SESSION_PRODUCT_PAGE,
  TOTAL,
} from '~/lib/constants/product.session';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getProducts} from './productList.server';
import {AppLoadContext} from '@remix-run/server-runtime';
import {Params, json} from '@remix-run/react';
import {
  filterDetailsCommitSession,
  getFilterDetailsSession,
} from '~/lib/utils/filter-session.server';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';

export const getFilterProduct = async (
  context: AppLoadContext,
  params: Params<string>,
  filterList: any,
  customerId: string,
  request: Request,
) => {
  const {session, storefront} = context;
  const categoryIdentifier = params.subCategorySlug;

  const filterDetailsSession = await getFilterDetailsSession(request);

  const minPrice = filterList.find((item: any) => item?.key == 'minPrice');
  const maxPrice = filterList.find((item: any) => item?.key === 'maxPrice');
  if (!minPrice && !maxPrice) {
    return await getProducts(
      context,
      params,
      filterList,
      customerId,
      [],
      true,
      request,
    );
  }

  const sessionUseStockProduct = filterDetailsSession.get(PRODUCT_STOCK_CODE);
  const sessionStockProductList = filterDetailsSession.get(
    PRODUCT_STOCK_CODE_INFO,
  );
  console.log('first', sessionStockProductList, sessionUseStockProduct);
  const currentPage = filterList.find((item: any) => item?.key === 'pageNo');
  const after = filterList.find((item: any) => item?.key === 'after');
  let sessionProductListLength = sessionUseStockProduct
    ? sessionUseStockProduct.length
    : 0;
  // before
  if (after && after?.value) {
    // if( sessionProductListLength > ( currentPage?.value * TOTAL )  ) {
    //     if( currentPage?.value > 1 ) {
    //         // let currentPage = 2
    //         let startProductStockCode   = ( currentPage?.value - 1 ) * TOTAL
    //         let endProductStockCode     = currentPage?.value * TOTAL
    //         let showNumberOfProduct     = endProductStockCode <= sessionProductListLength ?  sessionUseStockProduct.slice(startProductStockCode, endProductStockCode) : sessionUseStockProduct.slice(startProductStockCode, sessionProductListLength )
    //         // let showProductStockCode    = sessionUseStockProduct.splice(-showNumberOfProduct);
    //         const productList           =  await getProducts( context, params, filterList, customerId, showNumberOfProduct)
    //         productList.pageInfo.hasNextPage = true
    //         productList.pageInfo.hasPreviousPage = true
    //         return productList
    //     } else {
    //         let showNumberOfProduct = sessionUseStockProduct.slice(0, TOTAL)
    //         const productList           =  await getProducts( context, params, filterList, customerId, showNumberOfProduct)
    //         productList.pageInfo.hasPreviousPage = false
    //         return productList
    //     }
    // }

    if (
      sessionStockProductList &&
      sessionStockProductList?.stockCodes.length > 0
    ) {
      const productList = await getProducts(
        context,
        params,
        filterList,
        customerId,
        sessionStockProductList?.stockCodes,
        false,
        request,
      );

      if (productList?.formattedData?.productList.length === TOTAL) {
        const useStockCode = productList?.formattedData?.productList.map(
          (items: any) => ({stockCode: items?.stockCode}),
        );
        const notUseStockCode = sessionStockProductList?.stockCodes.filter(
          (item1: any) =>
            !useStockCode.some(
              (item2: any) => item2.stockCode === item1.stockCode,
            ),
        );
        sessionStockProductList.stockCodes = notUseStockCode;

        if (
          sessionStockProductList?.totalStockCode / GET_TOTAL_STOCKCODE >
          sessionStockProductList?.currentPage
        ) {
          productList.pageInfo.hasNextPage = true;
        }

        productList.pageInfo.hasPreviousPage = true;
        filterDetailsSession.set(PRODUCT_STOCK_CODE, [
          ...sessionUseStockProduct,
          ...useStockCode,
        ]);
        filterDetailsSession.set(
          PRODUCT_STOCK_CODE_INFO,
          sessionStockProductList,
        );
        return json(productList, {
          headers: [
            ['Set-Cookie', await session.commit({})],
            [
              'Set-Cookie',
              await filterDetailsCommitSession(filterDetailsSession, {
                maxAge: SESSION_MAX_AGE['30_DAYS'],
              }),
            ],
          ],
        });
        // return productList;
      }

      sessionStockProductList.stockCodes = [];
      const product = await recursiveProduct(
        context,
        params,
        filterList,
        customerId,
        productList,
        sessionStockProductList,
      );
      const useStockCode =
        product?.extraProducts?.formattedData?.productList.map(
          (items: any) => ({stockCode: items?.stockCode}),
        );
      filterDetailsSession.set(PRODUCT_STOCK_CODE, [
        ...sessionUseStockProduct,
        ...useStockCode,
      ]);
      filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, product?.stockCodes);
      product.extraProducts.pageInfo.hasPreviousPage = true;
      return json(product?.extraProducts, {
        headers: [
          ['Set-Cookie', await session.commit({})],
          [
            'Set-Cookie',
            await filterDetailsCommitSession(filterDetailsSession, {
              maxAge: SESSION_MAX_AGE['30_DAYS'],
            }),
          ],
        ],
      });
      // return product?.extraProducts;
    }

    if (
      sessionStockProductList?.totalStockCode / GET_TOTAL_STOCKCODE <
      sessionStockProductList?.currentPage
    ) {
      throw new Error('Product is empty');
    }

    const stockCode = await getStockCode(
      customerId,
      minPrice?.value,
      maxPrice?.value,
      sessionStockProductList?.currentPage + 1,
    );
    const productList = await getProducts(
      context,
      params,
      filterList,
      customerId,
      stockCode?.stockCodes,
      false,
      request,
    );

    if (!productList?.formattedData) {
      throw new Error('Product not founds');
    }
    // return productList
    if (productList?.formattedData?.productList.length === TOTAL) {
      const useStockCode = productList?.formattedData?.productList.map(
        (items: any) => ({stockCode: items?.stockCode}),
      );
      const notUseStockCode = stockCode?.stockCodes.filter(
        (item1: any) =>
          !useStockCode.some(
            (item2: any) => item2.stockCode === item1.stockCode,
          ),
      );
      stockCode.stockCodes = notUseStockCode;
      if (
        stockCode?.totalStockCode / GET_TOTAL_STOCKCODE >
        stockCode?.currentPage
      ) {
        productList.pageInfo.hasNextPage = true;
      }
      filterDetailsSession.set(PRODUCT_STOCK_CODE, [
        ...sessionUseStockProduct,
        ...useStockCode,
      ]);
      filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, stockCode);
      productList.pageInfo.hasPreviousPage = true;
      return json(productList, {
        headers: [
          ['Set-Cookie', await session.commit({})],
          [
            'Set-Cookie',
            await filterDetailsCommitSession(filterDetailsSession, {
              maxAge: SESSION_MAX_AGE['30_DAYS'],
            }),
          ],
        ],
      });

      // return productList;
    }

    if (productList?.formattedData?.productList.length < TOTAL) {
      stockCode.stockCodes = [];
      const product = await recursiveProduct(
        context,
        params,
        filterList,
        customerId,
        productList,
        stockCode,
      );
      const useStockCode =
        product?.extraProducts?.formattedData?.productList.map(
          (items: any) => ({stockCode: items?.stockCode}),
        );
      filterDetailsSession.set(PRODUCT_STOCK_CODE, [
        ...sessionUseStockProduct,
        ...useStockCode,
      ]);
      filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, product?.stockCodes);
      product.extraProducts.pageInfo.hasPreviousPage = true;
      return json(product?.extraProducts, {
        headers: [
          ['Set-Cookie', await session.commit({})],
          [
            'Set-Cookie',
            await filterDetailsCommitSession(filterDetailsSession, {
              maxAge: SESSION_MAX_AGE['30_DAYS'],
            }),
          ],
        ],
      });
      // return product?.extraProducts;
    }

    const products = productList?.formattedData?.productList;
    const displayProduct = products.slice(0, TOTAL);
    const extProduct = products.slice(TOTAL);
    productList.formattedData.productList = displayProduct;

    const useStockCode = productList?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    const notUseStockCode = stockCode?.stockCodes.filter(
      (item1: any) =>
        !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
    );
    stockCode.stockCodes = notUseStockCode;

    if (
      extProduct.length > 0 ||
      sessionStockProductList?.totalStockCode / GET_TOTAL_STOCKCODE >
        stockCode?.currentPage
    ) {
      productList.pageInfo.hasNextPage = true;
    }
    filterDetailsSession.set(PRODUCT_STOCK_CODE, [
      ...sessionUseStockProduct,
      ...useStockCode,
    ]);
    filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, stockCode);
    productList.pageInfo.hasPreviousPage = true;
    return json(productList, {
      headers: [
        ['Set-Cookie', await session.commit({})],
        [
          'Set-Cookie',
          await filterDetailsCommitSession(filterDetailsSession, {
            maxAge: SESSION_MAX_AGE['30_DAYS'],
          }),
        ],
      ],
    });
    // return productList;
  }

  const before = filterList.find((item: any) => item?.key === 'before');

  if (before && before?.value && currentPage) {
    if (currentPage?.value > 1) {
      // let currentPage = 2
      let startProductStockCode = (currentPage?.value - 1) * TOTAL;
      let endProductStockCode = currentPage?.value * TOTAL;
      let showNumberOfProduct =
        endProductStockCode <= sessionProductListLength
          ? sessionUseStockProduct.slice(
              startProductStockCode,
              endProductStockCode,
            )
          : sessionUseStockProduct.slice(
              startProductStockCode,
              sessionProductListLength,
            );
      // let showProductStockCode    = sessionUseStockProduct.splice(-showNumberOfProduct);
      const productList = await getProducts(
        context,
        params,
        filterList,
        customerId,
        showNumberOfProduct,
        false,
        request,
      );
      productList.pageInfo.hasNextPage = true;
      productList.pageInfo.hasPreviousPage = true;
      return productList;
    } else {
      let showNumberOfProduct = sessionUseStockProduct.slice(0, TOTAL);
      const productList = await getProducts(
        context,
        params,
        filterList,
        customerId,
        showNumberOfProduct,
        false,
        request,
      );
      productList.pageInfo.hasPreviousPage = false;
      return productList;
    }
  }

  const stockCode = await getStockCode(
    customerId,
    minPrice?.value,
    maxPrice?.value,
  );
  const productList = await getProducts(
    context,
    params,
    filterList,
    customerId,
    stockCode?.stockCodes,
    false,
    request,
  );
  // return true
  if (!productList?.formattedData) {
    throw new Error('Product not founds');
  }
  // return productList
  if (productList?.formattedData?.productList.length === TOTAL) {
    const useStockCode = productList?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    const notUseStockCode = stockCode?.stockCodes.filter(
      (item1: any) =>
        !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
    );
    stockCode.stockCodes = notUseStockCode;
    if (
      stockCode?.totalStockCode / GET_TOTAL_STOCKCODE >
      stockCode?.currentPage
    ) {
      productList.pageInfo.hasNextPage = true;
    }
    filterDetailsSession.set(PRODUCT_STOCK_CODE, useStockCode);
    filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, stockCode);
    return productList;
  }
  if (productList?.formattedData?.productList.length < TOTAL) {
    stockCode.stockCodes = [];
    const product = await recursiveProduct(
      context,
      params,
      filterList,
      customerId,
      productList,
      stockCode,
    );
    const useStockCode = product?.extraProducts?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    filterDetailsSession.set(PRODUCT_STOCK_CODE, useStockCode);
    filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, product?.stockCodes);
    return product?.extraProducts;
  }

  // if( productList?.formattedData?.productList.length > TOTAL ) {
  const products = productList?.formattedData?.productList;
  const displayProduct = products.slice(0, TOTAL);
  const extProduct = products.slice(TOTAL);
  productList.formattedData.productList = displayProduct;

  const useStockCode = productList?.formattedData?.productList.map(
    (items: any) => ({stockCode: items?.stockCode}),
  );
  const notUseStockCode = stockCode?.stockCodes.filter(
    (item1: any) =>
      !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
  );
  stockCode.stockCodes = notUseStockCode;

  if (
    extProduct.length > 0 ||
    stockCode?.totalStockCode / GET_TOTAL_STOCKCODE > stockCode?.currentPage
  ) {
    productList.pageInfo.hasNextPage = true;
  }
  filterDetailsSession.set(PRODUCT_STOCK_CODE, useStockCode);
  filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, stockCode);
  return json(productList, {
    headers: [
      ['Set-Cookie', await session.commit({})],
      [
        'Set-Cookie',
        await filterDetailsCommitSession(filterDetailsSession, {
          maxAge: SESSION_MAX_AGE['30_DAYS'],
        }),
      ],
    ],
  });
  // return productList;

  // return { extraProducts : productList, stockCodes : newStockCode }

  // }
};

const recursiveProduct = async (
  context: any,
  params: any,
  filterList: any,
  customerId: string,
  extraProducts: any,
  stockCodes: any,
  recursion = false,
): Promise<any> => {
  const stockCodePages = stockCodes?.totalStockCode / GET_TOTAL_STOCKCODE;
  if (stockCodePages <= stockCodes?.currentPage) {
    extraProducts.pageInfo.hasNextPage = false;
    return {extraProducts, stockCodes};
  }
  const minPrice = filterList.find((item: any) => item?.key == 'minPrice');
  const maxPrice = filterList.find((item: any) => item?.key === 'maxPrice');

  const newStockCode = await getStockCode(
    customerId,
    minPrice?.value,
    maxPrice?.value,
    stockCodes?.currentPage + 1,
  );

  newStockCode.stockCodes = [
    ...stockCodes?.stockCodes,
    ...newStockCode?.stockCodes,
  ];

  const productList = await getProducts(
    context,
    params,
    filterList,
    customerId,
    newStockCode?.stockCodes,
    false,
    context.request,
  );

  if (!productList?.formattedData) {
    throw new Error('Product not founds');
  }
  productList.formattedData.productList = [
    ...extraProducts?.formattedData?.productList,
    ...productList?.formattedData?.productList,
  ];

  if (productList?.formattedData?.productList.length === TOTAL) {
    const useStockCode = productList?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    const notUseStockCode = newStockCode?.stockCodes.filter(
      (item1: any) =>
        !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
    );
    newStockCode.stockCodes = notUseStockCode;
    if (stockCodePages > newStockCode?.currentPage) {
      productList.pageInfo.hasNextPage = true;
    } else {
      productList.pageInfo.hasNextPage = false;
    }
    return {extraProducts: productList, newStockCode};
  }

  if (productList?.formattedData?.productList.length > TOTAL) {
    const products = productList?.formattedData?.productList;
    const displayProduct = products.slice(0, TOTAL);
    const extProduct = products.slice(TOTAL);
    productList.formattedData.productList = displayProduct;

    const useStockCode = productList?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    const notUseStockCode = newStockCode?.stockCodes.filter(
      (item1: any) =>
        !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
    );
    newStockCode.stockCodes = notUseStockCode;

    if (extProduct.length > 0 || stockCodePages > newStockCode?.currentPage) {
      productList.pageInfo.hasNextPage = true;
    } else {
      productList.pageInfo.hasNextPage = false;
    }

    return {extraProducts: productList, stockCodes: newStockCode};
  }

  return await recursiveProduct(
    context,
    params,
    filterList,
    customerId,
    productList,
    newStockCode,
  );
};

const getStockCode = async (
  customerId: any,
  minPrice: any,
  maxPrice: any,
  page = 1,
) => {
  const url = `${ENDPOINT.PRODUCT.FILTER}/${customerId}?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}`;
  const stockCode = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: url,
  });

  if (stockCode?.errors) {
    return {};
  }

  if (!stockCode?.status) {
    return {};
  }

  return stockCode?.payload;
};
