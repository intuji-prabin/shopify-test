import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export interface ProductType {
  status: boolean;
  message: string;
  payload: Payload;
}
export interface Payload {
  categoryTitle: string;
  categoryHandle: string;
  categoryId: string;
  totalProducts: number;
  productList: ProductList[];
}
export interface ProductList {
  id: string;
  title: string;
  handle: string;
  stockCode: string;
  uom: string;
  variants: Variants;
  featuredImageUrl: null;
  volumePrice: boolean;
  companyPrice: number;
  currency: string;
  defaultPrice: number;
  liked: boolean;
  currencySymbol: string;
  imageBackgroundColor: string;
}
export interface Variants {
  id: string;
  sku: string;
  moq: number | string;
}

export async function getProducts({
  context,
  request,
  customerID,
  slug,
  filter,
}: {
  context: AppLoadContext;
  request: Request;
  customerID: string;
  slug: string;
  filter: string;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const response = await useFetch<ProductType>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PRODUCT.GET_PRODUCTS}/${slug}/${customerID}${filter}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });
    if (!response.status) {
      throw new Error(response.message);
    }
    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
