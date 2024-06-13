import {AppLoadContext, json, redirect} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {
  USER_SESSION_KEY,
  isImpersonating,
} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import {
  USER_DETAILS_KEY,
  destroyUserDetailsSession,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';

type ImpersonateResponse = {
  status: boolean;
  payload: Payload;
  message: string;
};

type Payload = {
  id: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  impersonateEnable: boolean;
  meta: Meta;
  impersonatingUser: ImpersonatingUser;
};

type Address = {
  id: string;
  address1: string;
};

type Meta = {
  parent: MetaValue;
  status: MetaValue;
  userRole: UserRole;
  company: Company;
  imageUrl: MetaValue;
  customerCode: MetaValue;
};

type MetaValue = {
  value: string;
  key: string;
};

type UserRole = {
  value: string;
  key: string;
  permissions: string[];
};

type Company = {
  value: string;
  key: string;
  companyId: string;
  name: string;
};

export type ImpersonatingUser = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
};

export async function getImpersonate({
  request,
  context,
  customerId,
  staffId,
}: {
  request: Request;
  context: AppLoadContext;
  customerId: string;
  staffId: string;
}) {
  const {session} = context;
  const userDetailsSession = await getUserDetailsSession(request);
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const response = await useFetch<ImpersonateResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.SUPPORT.IMPERSONATE}/${customerId}/${staffId}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!response.status) {
      setErrorMessage(messageSession, response.message);
      return redirect(Routes.LOGIN, {
        headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
      });
    }
    const accessToken = response.payload.impersonatingUser.token;
    if (accessToken) {
      session.set(USER_SESSION_KEY, accessToken);
      userDetailsSession.set(USER_DETAILS_KEY, response.payload);
    }
    return redirect('/', {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        [
          'Set-Cookie',
          await userDetailsCommitSession(userDetailsSession, {
            maxAge: SESSION_MAX_AGE['7_DAYS'],
          }),
        ],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return redirect(Routes.LOGIN, {
        headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
      });
    }
    setErrorMessage(messageSession, DEFAULT_ERRROR_MESSAGE);
    return redirect(Routes.LOGIN, {
      headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
    });
  }
}

export async function getLogoutImpersonate({
  request,
  context,
  customerId,
  impersonateId,
}: {
  request: Request;
  context: AppLoadContext;
  customerId: string;
  impersonateId: string;
}) {
  const {session} = context;
  const userDetailsSession = await getUserDetailsSession(request);
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  const response = await useFetch<ImpersonateResponse>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.SUPPORT.IMPERSONATE_LOGOUT}/${customerId}/${impersonateId}`,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });

  if (!response.status) {
    setErrorMessage(messageSession, response.message);
    return json(
      {},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
  return redirect(Routes.LOGIN, {
    headers: [
      ['Set-Cookie', await messageCommitSession(messageSession)],
      ['Set-Cookie', await destroyUserDetailsSession(userDetailsSession)],
      ['Set-Cookie', await session.destroy()],
    ],
  });
}
