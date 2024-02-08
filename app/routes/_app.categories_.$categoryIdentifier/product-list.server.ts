import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';

export async function getProducts(context: any, params: any, filterList: any) {
  const {storefront} = context;
  const {categoryIdentifier} = params;

  const filters = filterBuilder(filterList);

  const products = await storefront.query(
    STOREFRONT_PRODUCT_GET_QUERY(filters, categoryIdentifier, cursor),
  );

  const pageInfo = products?.collection?.products?.pageInfo;
  const formattedData = formattedResponse(products);
  console.log('iii', pageInfo);
  return {formattedData, pageInfo};
}

const filterBuilder = (filterList: any) => {
  let filterData = `{}`;
  if (filterList.length > 0) {
    filterList.map((item: any) => {
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
    });
  }
  return `[${filterData}]`;
};

const formattedResponse = (response: any) => {
  if (!response?.collection) {
    return [];
  }

  if (response?.collection?.products?.edges.length < 1) {
    return [];
  }
  const productList = response?.collection?.products?.edges;

  const finalProductList: any = productList.map((item: any) => ({
    title: item?.node?.title,
    variants: productVariantDataFormat(item?.node?.variants),
    featuredImageUrl: item?.node?.featuredImage?.url || DEFAULT_IMAGE.IMAGE,
  }));

  return finalProductList;
};

const productVariantDataFormat = (variant: any) => {
  const finalVariantData = {
    sku: variant?.edges[0]?.node?.sku,
  };
  return finalVariantData;
};

const STOREFRONT_PRODUCT_GET_QUERY = (
  filterList: any,
  handler: string,
  cursor: string,
) => {
  const product_query = `query ProductType {
    collection(handle: "${handler}" ) {
          id
          title 
          handle
          products( first: 3, filters: ${filterList}, after: "${cursor}" ) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
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
