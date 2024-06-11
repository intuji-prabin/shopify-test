import {AppLoadContext, redirect} from '@shopify/remix-oxygen';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';
import {Routes} from '~/lib/constants/routes.constent';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {
  USER_DETAILS_KEY,
  destroyUserDetailsSession,
  getUserDetails,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';
import {CustomerData} from '~/routes/_public.login/login.server';

export const USER_SESSION_KEY = 'accessToken';
export const USER_SESSION_ID = 'sessionId';

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
  sessionId,
}: {
  request: Request;
  accessToken: string;
  rememberMe: 'on' | undefined;
  context: AppLoadContext;
  customerData: CustomerData;
  sessionId?: string;
}) {
  const {session} = context;

  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);

  session.set(USER_SESSION_KEY, accessToken);
  session.set(USER_SESSION_ID, sessionId); // Store sessionId in session

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

export async function isAuthorize(request: Request, permission: string) {
  const userDetailsSession = await getUserDetailsSession(request);
  const userDetail = userDetailsSession.get(USER_DETAILS_KEY);
  // Find the 'add_customer' permission in user's role permissions
  const hasAddCustomerPermission =
    userDetail.meta.user_role.permission.includes(permission);

  return hasAddCustomerPermission;
}

export async function isImpersonating(request: Request) {
  const {userDetails} = await getUserDetails(request);
  return userDetails?.impersonateEnable ? 'true' : 'false';
}

export async function logout({
  context,
  request,
  logoutMessage = 'Logout Successfully',
  type = 'success',
}: {
  request: Request;
  context: AppLoadContext;
  logoutMessage?: string;
  type?: 'error' | 'success';
}) {
  const {session} = context;

  const messageSession = await getMessageSession(request);
  const userDetailsSession = await getUserDetailsSession(request);
  const finalLogoutMessage = logoutMessage || 'Logout Successfully'; // Set the default message if logoutMessage is not provided

  type === 'success'
    ? setSuccessMessage(messageSession, finalLogoutMessage)
    : setErrorMessage(messageSession, finalLogoutMessage);

  return redirect(Routes.LOGIN, {
    headers: [
      ['Set-Cookie', await messageCommitSession(messageSession)],
      ['Set-Cookie', await destroyUserDetailsSession(userDetailsSession)],
      ['Set-Cookie', await session.destroy()],
    ],
  });
}
