import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {removeCart} from './order-place.server';
import {GET_CART_LIST} from './cart.server';

export const removeItemFromCart = async (context: any, request: Request) => {
  const formData = await request.formData();

  const itemList = Object.fromEntries(formData);
  const lineItemId = Object.values(itemList);

  if (lineItemId?.length < 1) {
    throw new Error('Cart item not provided');
  }

  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }

  const cartRemoveResponse = await removeCart(
    lineItemId,
    context,
    sessionCartInfo,
    true,
  );
  const cartSession = {...sessionCartInfo, cartItems: [], lineItems: 0};

  if (cartSession) {
    const cartLists = await context.storefront.query(GET_CART_LIST, {
      variables: {cartId: cartSession?.cartId},
    });
  }

  context.session.set(CART_SESSION_KEY, cartSession);
  return {cartSession};
  //   console.log('werwerewv ', lineItemId);
  // if( ! itemList )
};
