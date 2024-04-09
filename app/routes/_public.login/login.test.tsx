import {describe, expect, it} from 'vitest';
import {loader} from '~/routes/_public.login/route';
import {HydrogenCart, Storefront} from '@shopify/hydrogen';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';
import {LoginFormFieldSchema} from '~/routes/_public.login/login-form';
import {
  AppLoadContext,
  Session,
  SessionStorage,
  createCookieSessionStorage,
} from '@shopify/remix-oxygen';

class HydrogenSession {
  #sessionStorage;
  #session;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: '_session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
        secure: true,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    return this.#session.unset;
  }

  get set() {
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit({rememberMe}: {rememberMe?: boolean}) {
    return this.#sessionStorage.commitSession(this.#session, {
      // 30 days or 7 days => need improvements
      maxAge: rememberMe
        ? SESSION_MAX_AGE['30_DAYS']
        : SESSION_MAX_AGE['7_DAYS'],
    });
  }
}

describe('Login Form Field Schema', () => {
  it('validates the login form fields', () => {
    const results = LoginFormFieldSchema.safeParse({
      email: 'test@gmail.com',
      password: 'password',
      rememberMe: 'on',
    });
    expect(results.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const results = LoginFormFieldSchema.safeParse({
      email: 'test',
      password: 'password',
      rememberMe: 'on',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Must be a valid email',
    );
  });

  it('require password', () => {
    const results = LoginFormFieldSchema.safeParse({
      email: 'test@gmail.com',
      password: '',
    });
    expect(results.success).toBe(false);
    expect(!results.success && results.error.errors[0].message).toBe(
      'Password is required',
    );
  });
});

describe('Login Loader', async () => {
  const request = new Request('http://localhost:4000/login');

  const session = await HydrogenSession.init(request, [
    'cYusSF3mXY2gSKyHicay5jdrvZzWgPPHlGD3M2fo3zE=',
  ]);

  const context: AppLoadContext = {
    session: session as any,
    env: {} as Env,
    cart: {} as HydrogenCart,
    storefront: {} as Storefront<I18nLocale>,
    waitUntil: () => {},
  };

  it('returns empty object if access token is not present', async () => {
    const response = await loader({context, params: {}, request});

    expect(response.status).toBe(200);

    const responseData = await response.json();

    expect(responseData).toEqual({});
  });

  it('redirects to / if access token is present', async () => {
    session.set('accessToken', 'hello');

    const response = await loader({context, params: {}, request});

    expect(session.get('accessToken')).toBe('hello');

    expect(response.headers.get('Location')).toBe('/');
  });
});
