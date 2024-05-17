import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {removeCart} from './order-place.server';
import {getCartList} from './cart.server';
import {useFormatCart} from '~/hooks/useFormatCart';

export const removeItemFromCart = async (
  formData: any,
  context: any,
  request: Request,
) => {
  const itemList = Object.fromEntries(formData);
  console.log('itemList', itemList);
  const lineItemId = Object.keys(itemList)
    .filter((key) => key !== 'action')
    .map((key) => itemList[key]) as any;
  console.log('first lineItemId', lineItemId);

  if (lineItemId?.length < 1) {
    throw new Error('Cart item not provided');
  }

  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  console.log('lineItemId', lineItemId);
  const cartRemoveResponse = await removeCart(
    lineItemId,
    context,
    sessionCartInfo,
    true,
  );
  const cartSession = {
    ...sessionCartInfo,
    cartItems: [],
    lineItems: cartRemoveResponse,
  };
  const finalCartSession = useFormatCart(cartSession);
  context.session.set(CART_SESSION_KEY, finalCartSession);
  await getCartList(context, request, cartSession);
  return {cartSession};
};
