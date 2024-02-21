import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';

type FilterItem = {
  key: string;
  value: string[];
};
type FilterType = FilterItem[];

export async function getProducts(
  context: any,
  params: any,
  filterList: FilterType,
) {
  const {storefront} = context;
  const categoryIdentifier = params.subCategoryId;
  const filters = filterBuilder(filterList);

  const products = await storefront.query(
    STOREFRONT_PRODUCT_GET_QUERY(filters, categoryIdentifier),
  );

  const pageInfo = products?.collection?.products?.pageInfo;
  const formattedData = formattedResponse(products);
  return {formattedData, pageInfo};
}

const filterBuilder = (filterList: FilterType) => {
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
  if (cursor && after) {
    pageinfo = `first: 9 after: "${cursor}"`;
  } else if (cursor && before) {
    pageinfo = `last: 9 before: "${cursor}"`;
  } else {
    pageinfo = `first: 9`;
  }

  return `filters: [${filterData}] ${pageinfo}`;
};

const formattedResponse = (response: any) => {
  if (
    !response?.collection ||
    response?.collection?.products?.edges.length < 1
  ) {
    return [];
  }

  const productList = response?.collection;

  const finalProductList: any = {
    categorytitle: productList?.title,
    productList: productList?.products?.edges.map((item: any) => ({
      title: item?.node?.title,
      variants: productVariantDataFormat(item?.node?.variants),
      featuredImageUrl: item?.node?.featuredImage?.url || DEFAULT_IMAGE.IMAGE,
    })),
  };

  return finalProductList;
};

const productVariantDataFormat = (variant: any) => {
  const finalVariantData = {
    sku: variant?.edges[0]?.node?.sku,
  };
  return finalVariantData;
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
                    featuredImage {
                      url
                    }
                    variants(first:2) {
                        edges {
                            node {
                                sku
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
