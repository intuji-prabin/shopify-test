import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {
  PRODUCT_STOCK_CODE,
  PRODUCT_STOCK_CODE_INFO,
} from '~/lib/constants/product.session';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type FilterItem = {
  key: string;
  value: string[];
};
type FilterType = FilterItem[];

export async function getProducts(
  context: any,
  params: any,
  filterList: FilterType,
  customerId: string,
  stockCode = [],
  toNotFilter = false,
) {
  const {storefront} = context;
  const categoryIdentifier = params.subCategoryId;
  // const filters = filterBuilder(filterList);
  const filters = filterBuilder(filterList, stockCode);

  const products = await storefront.query(
    STOREFRONT_PRODUCT_GET_QUERY(filters, categoryIdentifier),
  );

  if (!products?.collection) {
    throw new Error('Category of product not found');
  }

  const pageInfo = products?.collection?.products?.pageInfo;
  const formattedData = await formattedResponse(products, customerId);

  if (toNotFilter) {
    context.session.unset(PRODUCT_STOCK_CODE);
    context.session.unset(PRODUCT_STOCK_CODE_INFO);
  }

  return {formattedData, pageInfo};
}

const filterBuilder = (filterList: FilterType, stockCode: any) => {
  let filterData = `{}`;
  let cursor = null;
  let after = false;
  let before = false;
  let pageinfo = '';
  if (filterList.length > 0) {
    filterList.map((item: any) => {
      if (
        item?.key != 'page' &&
        item.key != 'after' &&
        item.key != 'before' &&
        item.key != 'minPrice' &&
        item.key != 'maxPrice' &&
        item.key != 'pageNo'
      ) {
        if (item?.key == 'brand') {
          item?.value.map((filterValue: any) => {
            filterData = filterData + ` { productVendor: "${filterValue}"}`;
          });
        } else {
          item?.value.map((filterValue: any) => {
            filterData =
              filterData +
              ` { productMetafield: { namespace: "${item?.key}" key: "${item?.key}" value: "${filterValue}"}  }`;
          });
        }
      } else if (item?.key == 'page') {
        cursor = item?.value;
      } else if (item?.key == 'after' && item?.value[0] == 'true') {
        after = true;
      } else if (item?.key == 'before' && item?.value[0] == 'true') {
        before = true;
      }
    });
  }

  if (stockCode.length > 0) {
    stockCode.map((stList: any) => {
      filterData =
        filterData +
        ` { productMetafield: { namespace: "stock_code" key: "stock_code" value: "${stList?.stockCode}"}  }`;
    });
  }

  if (cursor && after && stockCode.length < 1) {
    pageinfo = `first: 9 after: "${cursor}"`;
  } else if (cursor && before && stockCode.length < 1) {
    pageinfo = `last: 9 before: "${cursor}"`;
  } else {
    pageinfo = `first: 9`;
  }

  return `filters: [${filterData}] ${pageinfo}`;
};

const formattedResponse = async (response: any, customerId: string) => {
  const productList = response?.collection;

  if (productList?.products?.edges.length < 1) {
    return {
      categorytitle: productList?.title,
      productList: [],
    };
  }

  let productIds = '';

  productList?.products?.edges.map((items: any) => {
    const productId = items?.node?.id.replace('gid://shopify/Product/', '');
    if (!productIds) {
      productIds = productId;
    } else {
      productIds += `,${productId}`;
    }
    return true;
  });
  const priceList = await getPrices(productIds, customerId);
  console.log('firstPriceList', priceList);

  const finalProductList: any = {
    categorytitle: productList?.title,
    productList: productList?.products?.edges.map((item: any) => {
      const productId = item?.node?.id.replace('gid://shopify/Product/', '');
      return {
        id: productId,
        title: item?.node?.title,
        handle: item?.node?.handle,
        stockCode: item?.node?.stockCode?.value,
        uom: item?.node?.uom?.value,
        variants: productVariantDataFormat(item?.node?.variants),
        featuredImageUrl: item?.node?.featuredImage?.url || DEFAULT_IMAGE.IMAGE,
        volumePrice:
          priceList?.[productId] &&
          priceList?.[productId]?.priceRange.length > 0
            ? true
            : false,
        companyPrice: priceList?.[productId]
          ? priceList?.[productId]?.company_price
          : null,
        currency: priceList?.[productId]
          ? priceList?.[productId]?.currency
          : null,
        defaultPrice: priceList?.[productId]
          ? priceList?.[productId]?.default_price
          : null,
      };
    }),
  };
  return finalProductList;
};

const productVariantDataFormat = (variant: any) => {
  const finalVariantData = {
    id: variant?.edges[0]?.node?.id,
    sku: variant?.edges[0]?.node?.sku,
    moq: variant?.edges[0]?.node?.moq?.value || 1,
  };
  return finalVariantData;
};

export const getPrices = async (produdctId: string, customerId: string) => {
  const customerID = customerId;
  const results = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.PRODUCT.GET_PRICE}/${customerID}?productIds=${produdctId}`,
  });

  if (results?.errors) {
    throw new Error('Somthing error occured.');
  }

  if (!results?.status) {
    throw new Error(`Price not found due to ${results?.message}`);
  }

  return results?.payload;
};

const STOREFRONT_PRODUCT_GET_QUERY = (filterList: any, handler: string) => {
  const product_query = `query getProductList {
    collection(handle: "${handler}" ) {
          id
          title 
          handle
          products( ${filterList}  ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            edges {
                node {
                    handle
                    id
                    title
                    stockCode : metafield( namespace: "stock_code" key: "stock_code" ) { value }
                    uom : metafield(namespace: "uom", key: "uom") { value }
                    featuredImage {
                      url
                    }
                    variants(first:2) {
                        edges {
                            node {
                                id
                                sku
                                moq : metafield( namespace: "moq", key: "moq" ) { value }
                            }
                        }
                    }
                }
            }
          }
        }
      }`;
  return product_query;
};
