import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

interface DefaultResponse {
  status: boolean;
  message: string;
}

export async function addProductToList({
  formData,
  customerId,
}: {
  formData: FormData;
  customerId: string;
}) {
  const url = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;

  const productId = formData.get('productId');
  const quantity = formData.get('quantity');
  const uom = formData.get('uom');

  const body = JSON.stringify({productId, quantity, uom});

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
