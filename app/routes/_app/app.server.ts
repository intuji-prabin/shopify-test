import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export async function getCategories() {
  const results: any = await useFetch({
    method: AllowedHTTPMethods.GET,
    url: ENDPOINT.CUSTOM.URL+ '/product/category'
  });

  if (!results) {
    throw new Error("Couldn't get categories");
  }
  return results;
}
