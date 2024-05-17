import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {removeCart} from './order-place.server';
import {getCartList} from './cart.server';
import {useFormatCart} from '~/hooks/useFormatCart';
import { emitter3 } from '~/lib/utils/emitter.server';
import { EVENTS } from '~/lib/constants/events.contstent';
import { getUserDetails } from '~/lib/utils/user-session.server';

export const removeItemFromCart = async (context: any, request: Request) => {
  const formData = await request.formData();
  const {userDetails} = await getUserDetails(request);

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
  const cartSession = {
    ...sessionCartInfo,
    cartItems: [],
    lineItems: cartRemoveResponse,
  };
  const finalCartSession = useFormatCart(cartSession);
  context.session.set(CART_SESSION_KEY, finalCartSession);
  await getCartList(context, request, cartSession);

  //this is use to emit notification for the cart on
  // Emit the notification asynchronously
  setTimeout(() => {
    emitter3.emit(EVENTS.NOTIFICATIONS_UPDATED.KEY, {
      payload: {
        type: 'cart',
        totalNumber: cartRemoveResponse,
        customerId: userDetails.id,
      },
    });
  }, 2000);

  return {cartSession};
};
