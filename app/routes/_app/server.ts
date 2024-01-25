import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';


export async function getCategories() {
  const results:any= await useFetch({
    method: AllowedHTTPMethods.GET,
    url: "https://casual-mink-routinely.ngrok-free.app/api/product/category",
  });

  if (!results) {
    throw new Error("Couldn't get categories");
  }
  return results
}
