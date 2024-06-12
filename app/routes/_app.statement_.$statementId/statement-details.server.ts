import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export async function getStatementDetails({
  context,
  request,
  statementId,
  customerId,
}: {
  context: AppLoadContext;
  request: Request;
  statementId: string;
  customerId: string;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.STATEMENT.GET}/${customerId}/${statementId}`;

    const results = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!results.status) {
      throw new Error(results.message);
    }

    return results.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
