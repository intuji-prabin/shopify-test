import {AppLoadContext} from '@remix-run/server-runtime';
import {ADMIN_ACCESS_TOKEN} from '~/lib/constants/auth.constent';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getAccessToken} from '~/lib/utils/auth-session.server';

type FetchParams = {
  method?: AllowedHTTPMethods;
  body?: string;
  url: string;
  impersonateEnableCheck: string;
  context: AppLoadContext;
  accessToken?: string;
};

export async function useFetch<T>({
  method = AllowedHTTPMethods.GET,
  body,
  url,
  impersonateEnableCheck,
  context,
  accessToken = '',
}: FetchParams) {
  let sessionAccessTocken = (await getAccessToken(context)) as string;
  if (!sessionAccessTocken || sessionAccessTocken === '') {
    sessionAccessTocken = accessToken;
  }
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
      Authorization: sessionAccessTocken,
      'Impersonate-Enable': impersonateEnableCheck,
    },
    body,
  };

  const response = await fetch(url, fetchOptions);

  // Experiment code for testing the error handling, can be removed later if not working as expected
  if (response.status === 500) {
    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }

  return await response.json<T>();
}
