import {AppLoadContext, redirect} from '@shopify/remix-oxygen';
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';
import {CustomerData} from '~/routes/_public.login/login.server';

const USER_SESSION_KEY = 'accessToken';
export const USER_DETAILS_KEY = 'userDetails';

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
  session.set(USER_SESSION_KEY, accessToken);
  session.set(USER_DETAILS_KEY, customerData);
  setSuccessMessage(messageSession, 'Login successfully');

  return redirect('/', {
    headers: [
      ['Set-Cookie', await session.commit({rememberMe: rememberMe === 'on'})],
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

export async function getUserDetails(context: AppLoadContext) {
  const {session} = context;
  const userDetails: CustomerData = session.get(USER_DETAILS_KEY);
  return {userDetails};
}

export async function logout(context: AppLoadContext) {
  const {session} = context;
  return redirect('/', {
    headers: {'Set-Cookie': await session.destroy()},
  });
}
