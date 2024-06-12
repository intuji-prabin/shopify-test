import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function promoCodeRemove(
  context: AppLoadContext,
  request: Request,
  reset = true,
) {
  const {userDetails} = await getUserDetails(request);
  const isImpersonatingCheck = await isImpersonating(request);
  const customerId = userDetails?.id;
  const url = `${ENDPOINT.PROMO_CODE.POST}/${customerId}`;

  const response = await useFetch<any>({
    url,
    method: AllowedHTTPMethods.DELETE,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });
  if (!reset) {
    return '';
  }
  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
