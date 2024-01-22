import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {validationError} from 'remix-validated-form';
import ForgetPasswordForm, {
  ForgetPassFormFieldValidator,
} from '~/routes/_public.forget-password/forget-password-form';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';

export const action = async ({request, context}: ActionFunctionArgs) => {
  try {
    const result = await ForgetPassFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email} = result.data;
    console.log({email});

    const passwordRecover = await customerRecover({email, context});

    console.log({passwordRecover});
    return json({...result.data});
  } catch (error) {
    return json({});
  }
};

export default function LoginPage() {
  return <ForgetPasswordForm />;
}
