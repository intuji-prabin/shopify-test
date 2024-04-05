import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function getWishlist(request: any) {
  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails?.id;
  const results = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
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
  context: any,
  request: any,
) {
  const {userDetails} = await getUserDetails(request);
  const {session} = context;
  const productIdKey = Object.values(productIds);
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.DELETE,
      url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
      body: JSON.stringify({productIds: productIdKey}),
    });
    const sessionWishlistInfo = session.get(WISHLIST_SESSION_KEY);
    if (results.status === false) {
      throw new Error('Failed to add to wishlist');
    }

    const payload = results.payload;
    const productWishlist = payload.product;
    const numberOfWishListed = productWishlist.length;
    const sessionSetData = {
      totalWishList: numberOfWishListed,
      wishItems: productWishlist,
    };
    session.set(WISHLIST_SESSION_KEY, sessionSetData);
    return payload;
  } catch (error) {
    return true;
  }
}
