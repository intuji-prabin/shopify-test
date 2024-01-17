import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import { validationError } from 'remix-validated-form';
import ForgetPasswordForm, { ForgetPassFormFieldValidator } from './forget-password-form';

export const action = async ({ request, context }: ActionFunctionArgs) => {
    const result = await ForgetPassFormFieldValidator.validate(
        await request.formData(),
    );

    if (result.error) {
        return validationError(result.error);
    }

    const { email } = result.data;

    return json(
        { ...result.data }
    );
};

export default function LoginPage() {
    return (
        <ForgetPasswordForm />
    );
}
