import {validationError} from 'remix-validated-form';
import {verifyLogin} from '~/routes/_public.login/login.server';
import {Routes} from '~/lib/constants/routes.constent';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import LoginForm, {
  LoginFormFieldValidator,
} from '~/routes/_public.login/login-form';
import {
  createUserSession,
  getAccessToken,
} from '~/lib/utils/authsession.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toastsession.server';

export const loader = async ({request}: LoaderFunctionArgs) => {
  const accessToken = await getAccessToken(request);
  if (accessToken) {
    return redirect('/');
  }
  return json({});
};

export const action = async ({request, context}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  try {
    const result = await LoginFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email, password, rememberMe} = result.data;

    const {accessToken} = await verifyLogin({email, password, context});

    if (!accessToken) return redirect(Routes.LOGIN);

    return createUserSession({request, accessToken, rememberMe});
  } catch (error: unknown) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {error},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }
    return json({error}, {status: 400});
  }
};

export default function LoginPage() {
  return <LoginForm />;
}
