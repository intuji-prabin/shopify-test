import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function getWishlist(context: AppLoadContext, request: Request) {
  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails?.id;
  const isImpersonatingCheck = await isImpersonating(request);
  const results = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });
  if (!results) {
    throw new Error('An Error has Occured');
  }
  if (!results?.status) {
    throw new Error(results?.message);
  }

  const payload = results.payload;

  if (payload.length < 1) {
    return [];
  }
  return payload;
}

export async function removeBulkFromWishlist(
  productIds: any,
  context: AppLoadContext,
  request: Request,
) {
  const {userDetails} = await getUserDetails(request);
  const {session} = context;
  const productIdKey = Object.values(productIds);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.DELETE,
      url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
      body: JSON.stringify({productIds: productIdKey}),
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });
    if (results.status === false) {
      throw new Error('Failed to add to wishlist');
    }

    const payload = results.payload;
    const productWishlist = payload.product;
    const numberOfWishListed = productWishlist.length;
    session.set(WISHLIST_SESSION_KEY, numberOfWishListed);
    return payload;
  } catch (error) {
    return true;
  }
}
