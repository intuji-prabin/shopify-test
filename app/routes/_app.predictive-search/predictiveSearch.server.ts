import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export async function getPredictiveSearch({
  context,
  request,
  customerID,
  searchTerm,
}: {
  context: AppLoadContext;
  request: Request;
  customerID: string;
  searchTerm: string;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const response = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.PREDICTIVE_SEARCH.GET}/${customerID}?search=${searchTerm}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });
    if (!response.status) {
      return [];
    }
    return response.payload;
  } catch (error) {
    console.log('SearchError', error);
    return [];
  }
}
