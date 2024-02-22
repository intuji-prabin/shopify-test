import {AppLoadContext, redirect} from '@shopify/remix-oxygen';
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {CustomerData} from '~/routes/_public.login/login.server';
import {
  USER_DETAILS_KEY,
  destroyUserDetailsSession,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';

const USER_SESSION_KEY = 'accessToken';

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
      ['Set-Cookie', await userDetailsCommitSession(userDetailsSession)],
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
    throw redirect('/login');
  }

  return accessToken;
}

export async function logout({
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}) {
  const {session} = context;

  const userDetailsSession = await getUserDetailsSession(request);

  return redirect('/', {
    headers: [
      ['Set-Cookie', await session.destroy()],
      ['Set-Cookie', await destroyUserDetailsSession(userDetailsSession)],
    ],
  });
}
