import {Params} from '@remix-run/react';
import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {
  GET_TOTAL_STOCKCODE,
  PRODUCT_STOCK_CODE,
  PRODUCT_STOCK_CODE_INFO,
  TOTAL,
} from '~/lib/constants/product.session';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getProducts} from './productList.server';

export const getFilterProduct = async (
  context: AppLoadContext,
  params: Params<string>,
  filterList: any,
  customerId: string,
  filterDetailsSession: any,
) => {
  const categoryIdentifier = params.subCategorySlug;
  const minPrice = filterList.find((item: any) => item?.key == 'minPrice');
  const maxPrice = filterList.find((item: any) => item?.key === 'maxPrice');
  if (!minPrice && !maxPrice) {
    return await getProducts(
      context,
      params,
      filterList,
      customerId,
      filterDetailsSession,
      [],
      true,
    );
  }

  const sessionUseStockProduct = filterDetailsSession.get(PRODUCT_STOCK_CODE);
  const sessionStockProductList = filterDetailsSession.get(
    PRODUCT_STOCK_CODE_INFO,
  );
  // console.log("sessionUseStockProduct ", sessionUseStockProduct)
  // console.log("sessionStockProductList ", sessionStockProductList)
  const currentPage = filterList.find((item: any) => item?.key === 'pageNo');
  const after = filterList.find((item: any) => item?.key === 'after');
  let sessionProductListLength = sessionUseStockProduct
    ? sessionUseStockProduct.length
    : 0;
  // before
  if (after && after?.value && currentPage) {
    if (sessionProductListLength > (currentPage?.value - 1) * TOTAL) {
      // console.log('new form ');
      if (currentPage?.value > 1) {
        // let currentPage = 2
        let startProductStockCode = (currentPage?.value - 1) * TOTAL;
        let endProductStockCode = currentPage?.value * TOTAL;
        // console.log("first startProductStockCode ", startProductStockCode)
        // console.log("first endProductStockCode ", endProductStockCode)
        let showNumberOfProduct =
          endProductStockCode < sessionProductListLength
            ? sessionUseStockProduct.slice(
                startProductStockCode,
                endProductStockCode,
              )
            : sessionUseStockProduct.slice(
                startProductStockCode,
                sessionProductListLength,
              );
        // console.log("first showNumberOfProduct ", showNumberOfProduct)
        // let showProductStockCode    = sessionUseStockProduct.splice(-showNumberOfProduct);
        const productList = await getProducts(
          context,
          params,
          filterList,
          customerId,
          filterDetailsSession,
          showNumberOfProduct,
        );
        productList.pageInfo.hasNextPage = false;
        productList.pageInfo.hasPreviousPage = true;
        if (
          sessionProductListLength > currentPage?.value * TOTAL ||
          sessionStockProductList?.totalStockCode / TOTAL >
            sessionStockProductList?.currentPage
        ) {
          productList.pageInfo.hasNextPage = true;
        }
        return productList;
      }
    }

    if (
      sessionStockProductList &&
      sessionStockProductList?.stockCodes.length > 0
    ) {
      const productList = await getProducts(
        context,
        params,
        filterList,
        customerId,
        filterDetailsSession,
        sessionStockProductList?.stockCodes,
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
        return productList;
      }

      sessionStockProductList.stockCodes = [];
      const product = await recursiveProduct(
        context,
        params,
        filterList,
        customerId,
        filterDetailsSession,
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
      return product?.extraProducts;
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
      filterDetailsSession,
      stockCode?.stockCodes,
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
      return productList;
    }

    if (productList?.formattedData?.productList.length < TOTAL) {
      stockCode.stockCodes = [];
      const product = await recursiveProduct(
        context,
        params,
        filterList,
        customerId,
        filterDetailsSession,
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
      return product?.extraProducts;
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
    return productList;
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
        filterDetailsSession,
        showNumberOfProduct,
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
        filterDetailsSession,
        showNumberOfProduct,
      );
      productList.pageInfo.hasPreviousPage = false;
      if (sessionProductListLength > TOTAL) {
        productList.pageInfo.hasNextPage = true;
      } else {
        productList.pageInfo.hasNextPage = false;
      }
      return productList;
    }
  }

  const stockCode = await getStockCode(
    customerId,
    minPrice?.value,
    maxPrice?.value,
  );
  // console.log('get stock code is ', stockCode);
  const productList = await getProducts(
    context,
    params,
    filterList,
    customerId,
    filterDetailsSession,
    stockCode?.stockCodes,
  );
  // return true
  if (!productList?.formattedData) {
    throw new Error('Product not founds');
  }
  // console.log("totall is ", productList?.formattedData?.productList.length)
  // return productList
  if (productList?.formattedData?.productList.length === TOTAL) {
    const useStockCode = productList?.formattedData?.productList.map(
      (items: any) => ({stockCode: items?.stockCode}),
    );
    const notUseStockCode = stockCode?.stockCodes.filter(
      (item1: any) =>
        !useStockCode.some((item2: any) => item2.stockCode === item1.stockCode),
    );
    // console.log('useStockCode s ', useStockCode);
    // console.log('notUseStockCode b ', notUseStockCode);
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
      filterDetailsSession,
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
  // console.log('useStockCode ', useStockCode);
  // console.log('stockCode ', stockCode);
  filterDetailsSession.set(PRODUCT_STOCK_CODE, useStockCode);
  filterDetailsSession.set(PRODUCT_STOCK_CODE_INFO, stockCode);
  return productList;
  // return { extraProducts : productList, stockCodes : newStockCode }

  // }
};

const recursiveProduct = async (
  context: any,
  params: any,
  filterList: any,
  customerId: string,
  filterDetailsSession: any,
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
    filterDetailsSession,
    newStockCode?.stockCodes,
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
    filterDetailsSession,
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
