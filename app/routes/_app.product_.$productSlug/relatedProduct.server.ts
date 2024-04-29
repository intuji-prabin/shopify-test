import {CONSTANT} from '~/lib/constants/product.session';
import {getPrices} from '../_app.category_.$mainCategorySlug_.($categorySlug)_.($subCategorySlug)/productList.server';

export async function getSimilarProduct(
  context: any,
  collectionHandle: string,
  productID: string,
  customerId: string,
) {
  const {storefront} = context;

  const similarProducts = await storefront.query(
    STOREFRONT_SIMILAR_PRODUCT_GET_QUERY(`${collectionHandle}`),
  );
  if (similarProducts?.collection?.products === null) {
    console.log('error has occured');
    throw new Error('Invalid Product ID');
  } else {
    const prices = await getPrices(productID, customerId);
    console.log(
      'similarProducts?.productServer',
      similarProducts?.collection?.products.edges,
    );
    // const product = formatProduct(
    //   similarProducts?.collection?.products,
    //   prices,
    // );
    return {};
  }
}

// type Variant = {
//   edges: {
//     node: {
//       id: string;
//       sku: string;
//       moq: {
//         value: number;
//       };
//     };
//   }[];
// };

// export type ProductResponse = {
//   id: string;
//   handle: string;
//   title: string;
//   warranty: {value: string};
//   material: {value: string};
//   product_weight?: {value: string};
//   supplier: {value: string};
//   featuredImage: {url: string};
//   variants: Variant;
//   companyPrice: string;
//   currency: string;
//   defaultPrice: string;
//   vendor: string;
// };

// const formatProduct = (product: ProductResponse, prices: any) => {
//   const productId = product?.id.replace('gid://shopify/Product/', '');
//   const finalProductInfoArray = [
//     {key: 'warranty', value: product?.warranty?.value || 'N/A'},
//     {key: 'material', value: product?.material?.value || 'N/A'},
//     {key: 'product weight', value: product?.product_weight?.value || 'N/A'},
//     {key: 'supplier', value: product?.supplier?.value || 'N/A'},
//     {key: 'vendor', value: product?.vendor || 'N/A'},
//     {
//       key: 'minimum order quantity',
//       value: product?.variants?.edges[0]?.node?.moq?.value || 1,
//     },
//     {key: 'SKU', value: product?.variants?.edges[0]?.node?.sku || 'N/A'},
//   ];
//   return {
//     id: productId,
//     handle: product?.handle,
//     title: product?.title,
//     featuredImage: product?.featuredImage,
//     finalProductInfoArray: finalProductInfoArray,
//     companyPrice: prices?.[productId]
//       ? prices?.[productId]?.company_price
//       : 'N/A',
//     currency: prices?.[productId] ? prices?.[productId]?.currency : '$',
//     defaultPrice: prices?.[productId]
//       ? prices?.[productId]?.default_price
//       : 'N/A',
//     quantity: product?.variants?.edges[0]?.node?.moq?.value || 1,
//     selectedUOM: prices?.[productId]?.uomCode,
//     productVariantId: product?.variants?.edges[0]?.node?.id.replace(
//       CONSTANT.variantId,
//       '',
//     ),
//   };
// };

const STOREFRONT_SIMILAR_PRODUCT_GET_QUERY = (collectionHandle: string) => {
  const similar_product_query = `query getSimilarProduct {
    collection(handle: "${collectionHandle}"){
        id
        title
        handle
        products(first: 3) {
            edges{
                node {
                  handle
                  id
                  title
                  uom : metafield(namespace: "uom", key: "uom") { value }
                      featuredImage {
                    url
                  }
                  variants(first: 2) {
                    edges {
                      node {
                        id 
                          sku
                        moq : metafield(namespace: "moq", key: "moq") {value}
                      }
                    }
                  }
                }
              }
        }
      }
  }`;
  return similar_product_query;
};
