export async function getSingleProduct(context: any, productID: string) {
  const {storefront} = context;

  const products = await storefront.query(
    STOREFRONT_SINGLE_PRODUCT_GET_QUERY(`gid://shopify/Product/${productID}`),
  );

  const formattedResponse = formatProduct(products?.product);

  return {formattedResponse};
}

const formatProduct = (product: any) => {
  return {
    id: product?.id,
    handle: product?.handle,
    title: product?.title,
    warranty: product?.warranty?.value,
    material: product?.material?.value,
    product_weight: product?.product_weight?.value,
    supplier: product?.supplier?.value,
    featuredImage: product?.featuredImage?.url,
    variants: productVariantDataFormat(product?.variants),
  };
};

const productVariantDataFormat = (variant: any) => {
  const finalVariantData = {
    id: variant?.edges[0]?.node?.id,
    sku: variant?.edges[0]?.node?.sku,
    moq: variant?.edges[0]?.node?.moq?.value || 1,
  };
  return finalVariantData;
};

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
