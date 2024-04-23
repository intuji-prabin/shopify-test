import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';
import {AppLoadContext, redirect} from '@shopify/remix-oxygen';
import {CustomerData} from '~/routes/_public.login/login.server';
import {Routes} from '~/lib/constants/routes.constent';
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {
  USER_DETAILS_KEY,
  destroyUserDetailsSession,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';


export const USER_SESSION_KEY = 'accessToken';

/**
 * @description Creates a user session and sets cookies for the session, user details, and messages.
 * @returns {Promise<Response>} A promise that resolves to a response with a redirect to the home page and the set cookies.
 */

export async function createUserSession({
  request,
  accessToken,
  rememberMe,
  context,
  customerData,
}: {
  request: Request;
  accessToken: string;
  rememberMe: 'on' | undefined;
  context: AppLoadContext;
  customerData: CustomerData;
}) {
  const {session} = context;

  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);

  session.set(USER_SESSION_KEY, accessToken);

  userDetailsSession.set(USER_DETAILS_KEY, customerData);

  setSuccessMessage(messageSession, 'Login successfully');

  return redirect('/', {
    headers: [
      ['Set-Cookie', await session.commit({rememberMe: rememberMe === 'on'})],
      [
        'Set-Cookie',
        await userDetailsCommitSession(userDetailsSession, {
          maxAge:
            rememberMe === 'on'
              ? SESSION_MAX_AGE['30_DAYS']
              : SESSION_MAX_AGE['7_DAYS'],
        }),
      ],
      ['Set-Cookie', await messageCommitSession(messageSession)],
    ],
  });
}

export async function getAccessToken(
  context: AppLoadContext,
): Promise<string | undefined> {
  const {session} = context;

  const accessToken = session.get(USER_SESSION_KEY);

  return accessToken;
}

export async function isAuthenticate(context: AppLoadContext) {
  const accessToken = await getAccessToken(context);

  if (!accessToken) {
    throw redirect(Routes.LOGIN);
  }

  return accessToken;
}

export async function logout({
  context,
  request,
  logoutMessage = 'Logout Successfully',
}: {
  request: Request;
  context: AppLoadContext;
  logoutMessage?: string;
}) {
  const {session} = context;


  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);
  

  setSuccessMessage(messageSession, logoutMessage);

  return redirect(Routes.LOGIN, {
    headers: [
      ['Set-Cookie', await messageCommitSession(messageSession)],
      ['Set-Cookie', await destroyUserDetailsSession(userDetailsSession)],
      ['Set-Cookie', await session.destroy()],
    ],
  });
}
