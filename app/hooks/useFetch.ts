import {ADMIN_ACCESS_TOKEN} from '~/lib/constants/auth.constent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type FetchParams = {
  method?: AllowedHTTPMethods;
  body?: string;
  url: string;
};

export async function useFetch<T>({
  method = AllowedHTTPMethods.GET,
  body,
  url,
}: FetchParams) {
  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
    },
    body,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json<T>();
}
