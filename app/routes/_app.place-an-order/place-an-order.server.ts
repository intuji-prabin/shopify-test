import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import { isImpersonating } from '~/lib/utils/auth-session.server';

interface DefaultResponse {
  status: boolean;
  message: string;
}

export async function addProductToList({
  request,
  body,
  customerId,
}: {
  request: Request;
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;
  const isImpersonatingCheck = await isImpersonating(request);

  const response = await useFetch<DefaultResponse>({
    url,
    method: AllowedHTTPMethods.POST,
    body,
    impersonateEnableCheck: isImpersonatingCheck,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
