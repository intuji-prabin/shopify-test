import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

interface DefaultResponse {
  status: boolean;
  message: string;
}

export async function addProductToList({
  body,
  customerId,
}: {
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;

  const response = await useFetch<DefaultResponse>({
    url,
    method: AllowedHTTPMethods.POST,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
