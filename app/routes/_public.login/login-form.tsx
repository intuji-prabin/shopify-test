import { Link, useNavigation } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, useIsSubmitting } from 'remix-validated-form';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import CheckboxInput from '~/components/ui/checkbox-input';
import { Input } from '~/components/ui/input';
import ValidatedFormPassword from '~/components/ui/validated-form-password';
import { Routes } from '~/lib/constants/routes.constent';

export const LoginFormFieldSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Must be a valid email' }),
  password: z.string().trim().min(1, { message: 'Password is required' }),
  rememberMe: z.literal('on').optional(),
});

export const LoginFormFieldValidator = withZod(LoginFormFieldSchema);

export type LoginFormType = z.infer<typeof LoginFormFieldSchema>;

export type LoginFormFieldNameType = keyof LoginFormType;

export default function LoginForm() {
  const isSubmitting = useIsSubmitting('login-form');
  const navigation = useNavigation();

  return (
    <div className={`md:w-[398px] w-full min-h-[414px] ${navigation.state === 'loading' && "pointer-events-none"}`}>
      <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
        <div className="flex flex-col items-center justify-center gap-y-5">
          <h4>Welcome back!</h4>
          <p>Please log in to your account</p>
        </div>
        <ValidatedForm
          method="post"
          id="login-form"
          validator={LoginFormFieldValidator}
          className="flex flex-col gap-y-6"
        >
          <div className="flex flex-col gap-y-4">
            <Input
              required
              type="email"
              name="email"
              label="Email"
              placeholder="email@example.com"
            />
            <ValidatedFormPassword
              name="password"
              placeholder="your password"
              label="password"
            />
            <div className="flex flex-wrap items-center justify-between gap-x-2">
              <CheckboxInput
                name="rememberMe"
                label="Remember Me"
                className="mt-1"
              />
              <Link
                to={Routes.FORGET_PASSWORD}
                className="text-sm font-normal leading-normal underline text-grey-900"
              >
                Forget Password ?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            log in
          </Button>
          <Link
            to={Routes.RESEND_ACTIVATION_LINK}
            className="text-sm font-normal leading-normal text-center underline text-grey-900"
          >
            Activation Link Expired ?
          </Link>
        </ValidatedForm>
      </div>
    </div>
  );
}
