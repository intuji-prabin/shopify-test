import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getCartList} from './cart.server';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {AppLoadContext} from '@remix-run/server-runtime';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export const promoCodeApply = async (
  promoCode: string,
  context: AppLoadContext,
  request: Request,
) => {
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails?.id;

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const cartList = await getCartList(context, request, sessionCartInfo, true);
  const finalCartList = cartList.map((item: any) => {
    return {
      productId: item.productId,
      uom: item.uom,
      quantity: item.quantity,
    };
  });
  const isImpersonatingCheck = await isImpersonating(request);
  const promoCodeResponse = await useFetch<any>({
    method: AllowedHTTPMethods.POST,
    url: `${ENDPOINT.PROMO_CODE.POST}/${customerId}`,
    body: JSON.stringify({productList: finalCartList, promoCode: promoCode}),
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });

  if (!promoCodeResponse?.status) {
    throw new Error(promoCodeResponse?.message);
  }

  return promoCodeResponse;
};
