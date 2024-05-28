import {Link, useActionData} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {ArrowLeftSmall} from '~/components/icons/arrowleft';
import ResendActivationLinkForm, {
  ResendActivationLinkFormFieldValidator,
} from './resend-activation-link-form';
import {getAccessToken} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {validationError} from 'remix-validated-form';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {Routes} from '~/lib/constants/routes.constent';

export async function loader({context}: LoaderFunctionArgs) {
  const accessToken = await getAccessToken(context);

  if (accessToken) {
    return redirect('/');
  }

  return null;
}

/**
 * TO-DO : API Integration
 */
export async function action({request, context}: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  try {
    const result = await ResendActivationLinkFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email} = result.data;

    setSuccessMessage(messageSession, 'Email sent successfully');

    return json(
      {status: 'OK', email: result.data.email},
      {
        headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      error.message.split(' ')[1] === 'Resetting'
        ? setErrorMessage(
            messageSession,
            'Resetting password limit exceeded. Please try again later.',
          )
        : setErrorMessage(messageSession, error.message);

      return json(
        {error},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }

    setErrorMessage(messageSession, DEFAULT_ERRROR_MESSAGE);

    return json(
      {error},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
}

export default function ResendActivationLinkPage() {
  const data = useActionData<typeof action>();
  return (
    <div className="md:w-[398px] w-full min-h-[414px]">
      <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
        <div className="flex flex-col items-center justify-center gap-y-5">
          <h4>Activation Link Expired ?</h4>
        </div>
        {data?.status ? (
          <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3'>
            <AlertDescription className="text-base !translate-y-0">
              We’ve sent the activation link to your email ({data.email}) if it
              has been registered with us.
            </AlertDescription>
          </Alert>
        ) : (
          <ResendActivationLinkForm />
        )}
      </div>
      <div className="mt-4 text-center">
        <Link
          to={Routes.LOGIN}
          className="inline-flex items-center gap-3 px-6 py-2 text-sm italic font-bold uppercase border border-solid border-primary-500"
        >
          <ArrowLeftSmall /> back to log in
        </Link>
      </div>
    </div>
  );
}
