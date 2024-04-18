import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {CONSTANT} from '~/lib/constants/product.session';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {addProductToCart} from '../_app.product_.$productSlug/product.server';
import {AppLoadContext} from '@remix-run/server-runtime';

export interface ProductResponse {
  status: boolean;
  message: string;
  payload: {[key: string]: Payload};
}
export interface Payload {
  productId: string;
  variantId: string;
  uom: string;
  moq: string;
  unitOfMeasure: UnitOfMeasure[];
}
export interface UnitOfMeasure {
  unit: string;
  conversion_factor: number;
}

export async function getProductList(
  formData: {stockCode: string; quantity: number; uom: string}[],
) {
  const url = `${ENDPOINT.BULK.GET_PRODUCT}`;

  const body = JSON.stringify(formData);
  const productResponse = await useFetch<ProductResponse>({
    method: AllowedHTTPMethods.POST,
    url,
    body,
  });

  if (!productResponse?.status) {
    throw new Error(productResponse?.message);
  }
  return productResponse?.payload;
}

export const productBulkCart = async (
  cartInfo: {stockCode: string; quantity: number; uom: string}[],
  context: AppLoadContext,
  accessTocken: string,
  request: Request,
) => {
  try {
    const getProductResponse = await getProductList(cartInfo);
    const itemData: any = Object.values(getProductResponse).map((product) => {
      return {
        attributes: [
          {
            key: 'selectedUOM',
            value: product.uom,
          },
        ],
        merchandiseId: `${CONSTANT?.variantId}${product.variantId}`,
        quantity: parseInt(product.moq),
      };
    });
    const data = await addProductToCart(
      {},
      accessTocken,
      context,
      request,
      itemData,
    );
    if (!data) {
      throw new Error('Cart not added');
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error?.message);
    }
    throw new Error('Error has ocurred. Please try again later');
  }
};
