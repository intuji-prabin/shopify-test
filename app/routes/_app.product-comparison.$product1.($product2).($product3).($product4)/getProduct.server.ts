export async function getSingleProduct(context: any, productID: string) {
  const {storefront} = context;

  const products = await storefront.query(
    STOREFRONT_SINGLE_PRODUCT_GET_QUERY(`gid://shopify/Product/${productID}`),
  );

  return {products};
}

const STOREFRONT_SINGLE_PRODUCT_GET_QUERY = (productID: string) => {
  const single_product_query = `query getProductById {
    product(id: "${productID}") {
      id
      handle
      title
      warranty : metafield( namespace: "warranty", key: "warranty" ) { value }
      material : metafield( namespace: "material", key: "material" ) { value }
      product_weight : metafield( namespace: "product_weight", key: "product_weight" ) { value }
      supplier : metafield( namespace: "supplier", key: "supplier" ) { value }
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
  }`;
  return single_product_query;
};
