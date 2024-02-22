import {createCookieSessionStorage} from '@shopify/remix-oxygen';
import {USER_DETAILS_SESSION_SECRET} from '~/lib/constants/auth.constent';
import {CustomerData} from '~/routes/_public.login/login.server';

export const USER_DETAILS_KEY = 'userDetails';

export const {
  commitSession: userDetailsCommitSession,
  getSession,
  destroySession: destroyUserDetailsSession,
} = createCookieSessionStorage({
  cookie: {
    name: '__user-detail',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: [USER_DETAILS_SESSION_SECRET],
    secure: true,
  },
});

export async function getUserDetailsSession(request: Request) {
  const cookie = request.headers.get('cookie');

  return await getSession(cookie);
}

export async function getUserDetails(request: Request) {
  const userDetailsSession = await getUserDetailsSession(request);

  const userDetails: CustomerData = userDetailsSession.get(USER_DETAILS_KEY);

  return {userDetails};
}
