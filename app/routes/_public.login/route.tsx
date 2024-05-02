import { validationError } from 'remix-validated-form';
import {
  isUserActive,
  getCustomerByEmail,
  verifyLogin,
} from '~/routes/_public.login/login.server';
import { Routes } from '~/lib/constants/routes.constent';
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
} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import StorageService from '~/services/storage.service';
import { LOCAL_STORAGE_KEYS } from '~/lib/constants/general.constant';
<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> e52b3a7 (feat: fix conflict issue)

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const accessToken = await getAccessToken(context);

  if (accessToken) {
    return redirect('/');
  }
  return json({});
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  try {
    const result = await LoginFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const { email, password, rememberMe } = result.data;

    const { accessToken } = await verifyLogin({ email, password, context });

    if (!accessToken) return redirect(Routes.LOGIN);

    const customerData = await getCustomerByEmail({ email });

    const isActive = isUserActive(customerData.meta.status);

    if (!isActive) {
      throw new Error('User not active');
    }

    return createUserSession({
      request,
      accessToken,
      rememberMe,
      context,
      customerData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        { error },
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }
    return json({ error }, { status: 400 });
  }
};

export default function LoginPage() {
  React.useEffect(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const storageService = new StorageService(); // Assuming StorageService is a class
      storageService.remove(LOCAL_STORAGE_KEYS.PERMISSIONS); // Remove permission from localStorage
    }
  }, []);
  return <LoginForm />;
}
