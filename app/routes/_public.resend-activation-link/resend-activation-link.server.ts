import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

interface ResendActivationLinkResponse {
  message: string;
  status: boolean;
}

export async function resendActivationLink({
  request,
  email,
}: {
  request: Request;
  email: string;
}) {
  const body = JSON.stringify({email});
  const isImpersonatingCheck = await isImpersonating(request);

  const response = await useFetch<ResendActivationLinkResponse>({
    method: AllowedHTTPMethods.POST,
    url: `${ENDPOINT.CUSTOMER.ACTIVATE}`,
    body,
    impersonateEnableCheck: isImpersonatingCheck,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return {status: response.status, message: response.message};
}
