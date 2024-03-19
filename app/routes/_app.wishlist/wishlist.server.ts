import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
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
    throw new Error('WishList Not Found');
  }
  return payload;
}
