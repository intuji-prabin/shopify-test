import {createCookieSessionStorage} from '@shopify/remix-oxygen';
import {FILTER_SECRET} from '~/lib/constants/auth.constent';

export const {
  commitSession: filterDetailsCommitSession,
  getSession,
  destroySession: destroyFilterDetailsSession,
} = createCookieSessionStorage({
  cookie: {
    name: '_filter_details',
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: [FILTER_SECRET],
    secure: true,
  },
});

export async function getFilterDetailsSession(request: Request) {
  // console.log('getFilterDetailsSession', request.headers);
  const cookie = request.headers.get('cookie');

  return await getSession(cookie);
}
