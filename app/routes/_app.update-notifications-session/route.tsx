import {ActionFunctionArgs, redirect} from '@remix-run/server-runtime';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
export async function loader({request, context}: ActionFunctionArgs) {
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  let sessionWishlistInfo = await context.session.get(WISHLIST_SESSION_KEY);

  const headers: HeadersInit = [];

  // Retrieve the returnUrl from the request query parameters
  const returnUrl = new URL(request.url).searchParams.get('returnUrl');
  const type = new URL(request.url).searchParams.get('type');
  const totalNumber = new URL(request.url).searchParams.get('totalNumber');
  if(totalNumber !== null){
    if (type === 'cart') {
      if (sessionCartInfo) {
        const finalCartSession = {
          cartId: sessionCartInfo?.cartId,
          lineItems: totalNumber,
        };
        context.session.set(CART_SESSION_KEY, finalCartSession);
        headers.push(['Set-Cookie', await context.session.commit({})]);
      }
    } else
     if (type === 'wishlist') {
      if(sessionWishlistInfo){
        await context.session.set(WISHLIST_SESSION_KEY, totalNumber);
        headers.push(['Set-Cookie', await context.session.commit({})]);
      }
      
    }
  
  }
  
  return redirect(`${returnUrl}`, {
    headers,
  });
}
