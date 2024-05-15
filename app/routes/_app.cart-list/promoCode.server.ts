import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getCartList} from './cart.server';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';

export const promoCode = async (
  promoCode: string,
  customerId: string,
  context: any,
  request: Request,
) => {
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const cartList = await getCartList(context, request, sessionCartInfo, true);
  console.log('cartList', cartList);
  const promoCodeResponse = await useFetch<any>({
    method: AllowedHTTPMethods.POST,
    url: `${ENDPOINT.PROMO_CODE.POST}/${customerId}`,
    body: JSON.stringify({productList: cartList, promoCode: promoCode}),
  });

  if (!promoCodeResponse?.status) {
    throw new Error(promoCodeResponse?.message);
  }

  return promoCodeResponse?.payload;
};
