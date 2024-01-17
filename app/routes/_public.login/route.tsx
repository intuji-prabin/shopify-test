import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import { validationError } from 'remix-validated-form';
import LoginForm, {
    LoginFormFieldValidator,
} from '~/routes/_public.login/login-form';

export const action = async ({ request, context }: ActionFunctionArgs) => {
    const result = await LoginFormFieldValidator.validate(
        await request.formData(),
    );

    if (result.error) {
        return validationError(result.error);
    }

    const { email, password, rememberMe } = result.data;

    return json(
        { ...result.data }
    );
};

export default function LoginPage() {
    return (
        <LoginForm />
    );
}
