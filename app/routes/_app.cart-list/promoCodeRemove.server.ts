import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function promoCodeRemove(request: Request, reset = true) {
  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails?.id;
  const url = `${ENDPOINT.PROMO_CODE.POST}/${customerId}`;

  const response = await useFetch<any>({
    url,
    method: AllowedHTTPMethods.DELETE,
  });
  if (!reset) {
    return '';
  }
  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
