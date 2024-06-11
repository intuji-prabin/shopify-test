import {validationError} from 'remix-validated-form';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {useFetch} from '~/hooks/useFetch';
import {json, redirect} from '@remix-run/server-runtime';
import {Routes} from '~/lib/constants/routes.constent';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {CreateTicketFormFieldValidator} from '~/routes/_app.support_.create-ticket/create-ticket-form';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {isImpersonating} from '~/lib/utils/auth-session.server';

type CreateTicketResponse = {
  status: boolean;
  message: string;
  payload: [];
};

export async function createTicket({
  request,
  customerId,
}: {
  request: Request;
  customerId: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const result = await CreateTicketFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const body = JSON.stringify({
      ...result.data,
      customerId,
    });

    const results = await useFetch<CreateTicketResponse>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.SUPPORT.TICKETS}/${customerId}`,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
    });

    if (!results.status) {
      throw new Error(results.message);
    }

    setSuccessMessage(messageSession, results.message);

    return redirect(Routes.SUPPORT_TICKETS, {
      headers: {
        'Set-Cookie': await messageCommitSession(messageSession),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
