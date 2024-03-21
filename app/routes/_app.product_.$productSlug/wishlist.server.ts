import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/user-session.server';

export interface WishListResponse {
  status: boolean;
  message: string;
  payload: Payload;
}

export interface Payload {
  id: number;
  companyId: string;
  product: Product[];
}

export interface Product {
  id: number;
  productId: string;
}

export async function addToWishlist(
  productId: any,
  context: any,
  request: any,
) {
  const {userDetails} = await getUserDetails(request);
  const {session} = context;
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<WishListResponse>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
      body: JSON.stringify({productId: productId?.productId}),
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

export async function removeFromWishlist(
  productId: any,
  context: any,
  request: any,
) {
  const {userDetails} = await getUserDetails(request);
  const {session} = context;
  // console.log("productIdWish", productId)
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<WishListResponse>({
      method: AllowedHTTPMethods.DELETE,
      url: `${ENDPOINT.WISHLIST.ADD}/${customerId}`,
      body: JSON.stringify({productId: productId?.productId}),
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
