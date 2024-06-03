import {json} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';

interface BaseResponse {
  status: boolean;
  message: string;
}

interface ImpersonateResponse extends BaseResponse {
  payload: {
    impersonateActive: boolean;
  };
}

export async function getImpersonateStatus(customerId: string) {
  try {
    const url = `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}`;

    const response = await useFetch<ImpersonateResponse>({
      url,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export async function updateImpersonateStatus({
  customerId,
  method,
  body,
  request,
}: {
  customerId: string;
  request: Request;
  method: AllowedHTTPMethods;
  body: string;
}) {
  const messageSession = await getMessageSession(request);
  try {
    const url = `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}`;

    const response = await useFetch<BaseResponse>({
      url,
      method,
      body,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    setSuccessMessage(messageSession, response.message);
    return json(
      {},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {error},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }
    setErrorMessage(messageSession, DEFAULT_ERRROR_MESSAGE);
    return json(
      {error},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
}
