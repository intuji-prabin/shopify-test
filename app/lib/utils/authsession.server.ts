import {createCookieSessionStorage, redirect} from '@shopify/remix-oxygen';
import {SESSION_SECRET} from '~/lib/constants/auth.constent';
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

const USER_SESSION_KEY = 'accessToken';
const USER_DETAILS_KEY = 'userDetails';

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [SESSION_SECRET],
    secure: true,
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get('cookie');
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  accessToken,
  rememberMe,
}: {
  request: Request;
  accessToken: string;
  rememberMe: 'on' | undefined;
}) {
  const session = await getSession(request);
  const messageSession = await getMessageSession(request);
  session.set(USER_SESSION_KEY, accessToken);
  setSuccessMessage(messageSession, 'Login successfully');

  return redirect('/', {
    headers: [
      [
        'Set-Cookie',
        await sessionStorage.commitSession(session, {
          // 30 days or 7 days => need improvements
          maxAge: rememberMe === 'on' ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
        }),
      ],
      ['Set-Cookie', await messageCommitSession(messageSession)],
    ],
  });
}

export async function getAccessToken(
  request: Request,
): Promise<string | undefined> {
  const session = await getSession(request);
  const accessToken = session.get(USER_SESSION_KEY);
  return accessToken;
}

export async function isAuthenticate(request: Request) {
  const accessToken = await getAccessToken(request);
  if (!accessToken) {
    throw redirect('/login');
  }
  return accessToken;
}

export async function getUserDetails(request: Request) {
  const session = await getSession(request);
  const userDetails = session.get(USER_DETAILS_KEY);
  return {userDetails};
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect('/', {
    headers: {'Set-Cookie': await sessionStorage.destroySession(session)},
  });
}
