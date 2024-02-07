export async function getProducts(
  context: any,
  params: any,
  companyID: any,
  filterList: any,
) {
  const {storefront} = context;
  const {categoryIdentifier} = params;

  const filters = filterBuilder(filterList, companyID);

  const products = await storefront.query(
    STOREFRONT_PRODUCT_GET_QUERY(filters, categoryIdentifier),
  );

  const formattedData = formattedResponse(products);
  return formattedData;
}

const filterBuilder = (filterList: any, companyID: any) => {
  let filterData = `{}`;
  if (filterList.length > 0) {
    filterList.map((item: any) => {
      if (item?.brand) {
        item?.brand.map((filterValue: any) => {
          filterData = filterData + ` { productVendor: "${filterValue}"}`;
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
    variants: productVariantDataFromate(item?.node?.variants),
  }));

  return finalProductList;
};

const productVariantDataFromate = (variant: any) => {
  const finalVariantData = {
    sku: variant?.edges[0]?.node?.sku,
  };
  return finalVariantData;
};

const STOREFRONT_PRODUCT_GET_QUERY = (filterList: any, handler: string) => {
  const product_query = `query ProductType {
    collection(handle: "${handler}" ) {
          id
          title 
          handle
          products( first: 10, filters: ${filterList} ) {
              edges {
                  node {
                      handle
                      id
                      title
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
