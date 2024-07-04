import {AppLoadContext, json} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {ImpersonationMessage} from '~/lib/constants/event.toast.message';
import {EVENTS} from '~/lib/constants/events.contstent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';
import {emitter} from '~/lib/utils/emitter.server';
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
    reason: string;
    status: string;
  };
}

export async function getImpersonateDetails(
  context: AppLoadContext,
  request: Request,
  customerId: string,
) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}`;

    const response = await useFetch<ImpersonateResponse>({
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
  context,
  customerId,
  method,
  body,
  request,
}: {
  context: AppLoadContext;
  customerId: string;
  request: Request;
  method: AllowedHTTPMethods;
  body: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}`;

    const response = await useFetch<BaseResponse>({
      url,
      method,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    // if(!isImpersonatingCheck){
    emitter.emit(EVENTS.LOGOUT.KEY, {
      customerId: customerId,
      message: ImpersonationMessage,
    });
    // }
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
    console.log('error', error);
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {status: false},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }
    setErrorMessage(messageSession, DEFAULT_ERRROR_MESSAGE);
    return json(
      {status: false},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
}
