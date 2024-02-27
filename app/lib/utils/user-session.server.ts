import {createCookieSessionStorage} from '@shopify/remix-oxygen';
import {CustomerData} from '~/routes/_public.login/login.server';
import {USER_DETAILS_SESSION_SECRET} from '~/lib/constants/auth.constent';

export const USER_DETAILS_KEY = 'userDetails';

export const {
  commitSession: userDetailsCommitSession,
  getSession,
  destroySession: destroyUserDetailsSession,
} = createCookieSessionStorage({
  cookie: {
    name: '_user_details',
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
