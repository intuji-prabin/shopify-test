import {Link, useActionData} from '@remix-run/react';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {validationError} from 'remix-validated-form';
import {ArrowLeftSmall} from '~/components/icons/arrowleft';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';
import ForgetPasswordForm, {
  ForgetPassFormFieldValidator,
} from '~/routes/_public.forget-password/forget-password-form';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';

type ActionResponse = {
  status: string | null;
  email: string | null;
};

export const action = async ({request, context}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  try {
    const result = await ForgetPassFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email} = result.data;
    const passwordRecover = await customerRecover({email, context});
    if (passwordRecover?.customerRecover?.customerUserErrors.length == 0) {
      setSuccessMessage(messageSession, 'Email sent successfully');
      return json(
        {status: 'OK', email: result.data.email},
        {
          headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
        },
      );
    } else {
      setErrorMessage(
        messageSession,
        passwordRecover?.customerRecover?.customerUserErrors[0]
          .message as string,
      );
      return json(
        {},
        {
          headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
        },
      );
    }
  } catch (error) {
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
  const data = useActionData<ActionResponse>();
  return (
    <div className="md:w-[398px] w-full min-h-[414px]">
      <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
        <div className="flex flex-col items-center justify-center gap-y-5">
          <h4>Forgot Password?</h4>
        </div>
        {data?.status ? (
          <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3'>
            <AlertDescription className="text-base !translate-y-0">
              We’ve sent the password reset instructions to your email (
              {data.email}) if it has been registered with us.
            </AlertDescription>
          </Alert>
        ) : (
          <ForgetPasswordForm />
        )}
      </div>
      <div className="mt-4 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-3 px-6 py-2 text-sm italic font-bold uppercase border border-solid border-primary-500"
        >
          <ArrowLeftSmall /> back to log in
        </Link>
      </div>
    </div>
  );
}
