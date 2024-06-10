import {AppLoadContext, redirect} from '@shopify/remix-oxygen';
import {json} from 'zod-form-data';
import {useFetch} from '~/hooks/useFetch';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {USER_SESSION_KEY} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
} from '~/lib/utils/toast-session.server';
import {
  USER_DETAILS_KEY,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';

export async function getImpersonate({
  context,
  customerId,
  staffId,
  userDetailsSession,
}: {
  userDetailsSession: any;
  context: AppLoadContext;
  customerId: string;
  staffId: string;
}) {
  const {session} = context;
  try {
    const response = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}/${staffId}`,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    console.log('first', response.payload);
    const accessToken = response.payload.impersonatingUser.token;
    if (accessToken) {
      session.set(USER_SESSION_KEY, accessToken);
      userDetailsSession.set(USER_DETAILS_KEY, response.payload);
    }
    console.log('first', accessToken);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {status: 500});
  }
}
