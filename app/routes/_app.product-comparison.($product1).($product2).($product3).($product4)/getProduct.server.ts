import {CONSTANT} from '~/lib/constants/product.session';
import {getPrices} from '../_app.category_.$mainCategorySlug_.($categorySlug)_.($subCategorySlug)/productList.server';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {AppLoadContext} from '@remix-run/server-runtime';

export async function getSingleProduct(
  request: Request,
  context: AppLoadContext,
  productID: string,
  customerId: string,
) {
  const {storefront} = context;

  const products = await storefront.query(
    STOREFRONT_SINGLE_PRODUCT_GET_QUERY(`gid://shopify/Product/${productID}`),
  );
  console.log('first product', products);
  if (products?.product === null) {
    console.log('error has occured');
    throw new Error('Invalid Product ID');
  } else {
    const prices = await getPrices(context, request, productID, customerId);
    const product = formatProduct(products?.product, prices);
    return {product};
  }
}

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
  companyPrice: string;
  currency: string;
  defaultPrice: string;
  vendor: string;
  custom_attributes: {value: string};
};

const formatProduct = (product: ProductResponse, prices: any) => {
  const productId = product?.id.replace('gid://shopify/Product/', '');
  const finalProductInfoArray = [
    {key: 'warranty', value: product?.warranty?.value || 'N/A'},
    {key: 'welding process', value: product?.material?.value || 'N/A'},
    {key: 'product weight', value: product?.product_weight?.value || 'N/A'},
    // {key: 'supplier', value: product?.supplier?.value || 'N/A'},
    // {key: 'vendor', value: product?.vendor || 'N/A'},
    {
      key: 'minimum order quantity',
      value: product?.variants?.edges[0]?.node?.moq?.value || 1,
    },
    {key: 'SKU', value: product?.variants?.edges[0]?.node?.sku || 'N/A'},
  ];
  let customAttrArray =
    product?.custom_attributes?.value &&
    (JSON.parse(product?.custom_attributes?.value) || ([] as string[]));
  return {
    id: productId,
    handle: product?.handle,
    title: product?.title,
    featuredImage:
      prices &&
      prices?.[productId].featuredImage &&
      prices?.[productId].featuredImage != ''
        ? prices?.[productId].featuredImage
        : DEFAULT_IMAGE.IMAGE,
    finalProductInfoArray: finalProductInfoArray,
    customAttribute: customAttrArray,
    companyPrice: prices?.[productId]
      ? prices?.[productId]?.company_price
      : 'N/A',
    currency: prices?.[productId] ? prices?.[productId]?.currency : '$',
    currencySymbol: prices?.[productId]?.currencySymbol,
    defaultPrice: prices?.[productId]
      ? prices?.[productId]?.default_price
      : 'N/A',
    quantity: product?.variants?.edges[0]?.node?.moq?.value || 1,
    selectedUOM: prices?.[productId]?.uomCode,
    productVariantId: product?.variants?.edges[0]?.node?.id.replace(
      CONSTANT.variantId,
      '',
    ),
  };
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
      custom_attributes : metafield( namespace: "custom_attributes", key: "custom_attributes" ) { value }
      vendor
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
