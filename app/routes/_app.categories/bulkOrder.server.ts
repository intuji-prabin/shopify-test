export async function getProductList(context: any) {
  const {storefront} = context;
  const products = await storefront.query(STOREFRONT_PRODUCT_GET_QUERY());
  console.log('firstProduct', products);
}

const STOREFRONT_PRODUCT_GET_QUERY = () => {
  const product_query = `query getProductList {
        products({productMetafield:{namespace:'stock_code' key:'stock_code' value:'A'}) {
            edges {
                node {
                    id
                    uom : metafield(namespace: "uom", key: "uom") { value }
                    variants(first:2) {
                        edges {
                            node {
                                id
                                moq : metafield( namespace: "moq", key: "moq" ) { value }
                            }
                        }
                    }
                }
            }
        }
    }
    `;
  return product_query;
};
