import { Form, useActionData } from '@remix-run/react';
import { ActionFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { useEffect, useState } from 'react';
import { DangerAlert } from '~/components/icons/alert';
import { Button } from '~/components/ui/button';
import Password from '~/components/ui/password';
import { changePassword } from './reset-password.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const customerId = searchParams.get("customer_id") as string;
  const resetToken = searchParams.get("reset_token") as string;

  const data = Object.fromEntries(await request.formData());
  const finalPassword = data?.password;
  const finalConfirmPassword = data?.confirmpassword;
  let validatePassword = (finalPassword: any) => {
    if (!finalPassword) {
      return 'This field is required';
    } else if (finalPassword.length < 8) {
      return 'This field must have atleast 8 characters';
    } else if (!/\d/.test(finalPassword)) {
      return 'This field must include a number';
    } else if (!/[A-Z]/.test(finalPassword)) {
      return 'This field must include at least one capital letter';
    } else if (!/[^A-Za-z0-9]/.test(finalPassword)) {
      return 'This field must include a special character';
    }
  };
  let validateConfirmPassword = (finalConfirmPassword: any) => {
    if (!finalConfirmPassword) {
      return 'This field is required';
    } else if (finalPassword !== finalConfirmPassword) {
      return 'Password does not match';
    }
  };
  const formErrors = {
    password: validatePassword(finalPassword),
    confirmpassword: validateConfirmPassword(finalConfirmPassword),
  };
  if (Object.values(formErrors).some(Boolean)) return { formErrors };

  const messageSession = await getMessageSession(request);
  try {
    const resetPassword = await changePassword({ context, customerId, password: finalPassword as string, resetToken })
    if (resetPassword) {
      setSuccessMessage(messageSession, 'Password changed successfully');
      return redirect('/login', {
        headers: [
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      });
    }
    setSuccessMessage(messageSession, 'Error occured');
    return json({ status: "ERROR" }, {
      headers: [
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {
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

const ResetPassword = () => {
  const [errorCount, setErrorCount] = useState<number>();
  const [errors, setErrors] = useState({
    minValueValidation: false,
    numberValidation: false,
    capitalLetterValidation: false,
    specialCharacterValidation: false,
  });

  const handlePasswordChange = (event: any) => {
    const newPassword = event.target.value;
    validatePassword(newPassword);
  };

  const validatePassword = (password: any) => {
    setErrors({
      minValueValidation: password.length >= 8,
      numberValidation: /\d/.test(password),
      capitalLetterValidation: /[A-Z]/.test(password),
      specialCharacterValidation: /[^A-Za-z0-9]/.test(password),
    });
  };
  useEffect(() => {
    const errorCount = Object.values(errors).filter((value) => value).length;
    setErrorCount(errorCount);
  }, [errors]);
  const actionData = useActionData<any>();
  return (
    <div className="md:w-[398px] w-full">
      <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
        <div className="flex flex-col items-center justify-center gap-y-5">
          <h4>Create a new password</h4>
        </div>
        <Form method="post" className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-4">
            <div>
              <Password
                name="password"
                placeholder="password"
                label="password"
                handlePasswordChange={handlePasswordChange}
              />
              <div className={errorCount ? 'flex mt-1 gap-x-2' : 'hidden'}>
                {Object.entries(errors).map(([key], index) => (
                  <span
                    key={key}
                    className={`basis-full rounded-full bg-grey-100 ${errorCount && errorCount >= index + 1
                      ? '!bg-semantic-success-500 h-1.5'
                      : ''
                      }`}
                  ></span>
                ))}
              </div>
              <p>
                {Object.entries(errors).map(([key, value]) => (
                  <span
                    key={key}
                    className={value ? 'text-green-500' : 'text-grey-500'}
                  >
                    {key === 'minValueValidation' &&
                      'Your password must be at least 8 character long'}
                    {key === 'numberValidation' && ', includes a number'}
                    {key === 'capitalLetterValidation' &&
                      ', includes at least one Capital Letter'}
                    {key === 'specialCharacterValidation' &&
                      ' and includes at least one Special Character'}
                  </span>
                ))}
              </p>
              {actionData?.formErrors?.password ? (
                <p className="pt-1 error-msg">
                  <DangerAlert />
                  <span className="pl-2">
                    {actionData?.formErrors?.password}
                  </span>
                </p>
              ) : null}
            </div>
            <div>
              <Password
                name="confirmpassword"
                placeholder="confirm password"
                label="confirm password"
              />
              {actionData?.formErrors?.confirmpassword ? (
                <p className="pt-1 error-msg">
                  <DangerAlert />
                  <span className="pl-2">
                    {actionData?.formErrors?.confirmpassword}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Change password
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
