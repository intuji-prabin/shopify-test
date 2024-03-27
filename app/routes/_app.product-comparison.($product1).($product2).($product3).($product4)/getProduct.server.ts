export async function getSingleProduct(context: any, productID: string) {
  const {storefront} = context;

  const products = await storefront.query(
    STOREFRONT_SINGLE_PRODUCT_GET_QUERY(`gid://shopify/Product/${productID}`),
  );

  const product = formatProduct(products?.product);

  return {product};
}

export type ProductResponse = {
  id: string;
  handle: string;
  title: string;
  warranty: {value: string};
  material: {value: string};
  product_weight?: {value: string};
  supplier: {value: string};
  featuredImage: {url: string};
  variants: Variant;
};

const formatProduct = (product: ProductResponse) => {
  return {
    id: product?.id,
    handle: product?.handle,
    title: product?.title,
    warranty: product?.warranty?.value,
    material: product?.material?.value,
    product_weight: product?.product_weight?.value,
    supplier: product?.supplier?.value,
    featuredImage: product?.featuredImage,
    variants: productVariantDataFormat(product?.variants),
  };
};

type Variant = {
  edges: {
    node: {
      id: string;
      sku: string;
      moq: {
        value: number;
      };
    };
  }[];
};

const productVariantDataFormat = (variant: Variant) => {
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
