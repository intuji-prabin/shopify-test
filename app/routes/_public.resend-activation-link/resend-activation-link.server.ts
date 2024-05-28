import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

interface ResendActivationLinkResponse {
  message: string;
  status: boolean;
}

export async function resendActivationLink({email}: {email: string}) {
  const body = JSON.stringify({email});

  const response = await useFetch<ResendActivationLinkResponse>({
    method: AllowedHTTPMethods.POST,
    url: `${ENDPOINT.CUSTOMER.ACTIVATE}`,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return {status: response.status, message: response.message};
}
