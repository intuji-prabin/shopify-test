import { Link } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';
import { ArrowLeftSmall } from '~/components/icons/arrowleft';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const ForgetPassFormFieldSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Must be a valid email' }),
});

export const ForgetPassFormFieldValidator = withZod(ForgetPassFormFieldSchema);

export type ForgetPassFormType = z.infer<typeof ForgetPassFormFieldSchema>;

export type ForgetPassFormFieldNameType = keyof ForgetPassFormType;

const ForgetPasswordForm = () => {
    return (
        <div className="md:w-[398px] w-full">
            <div className="flex flex-col p-8 space-y-8 bg-white shadow-3xl">
                <div className="flex flex-col items-center justify-center gap-y-5">
                    <h4>Forgot Password?</h4>
                </div>
                <ValidatedForm
                    method="post"
                    validator={ForgetPassFormFieldValidator}
                    className="flex flex-col gap-y-6"
                >
                    <div className="flex flex-col gap-y-4">
                        <Input
                            required
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="email"
                        />
                    </div>
                    <Button type="submit" variant="primary" className="w-full">
                        RESET PASSWORD
                    </Button>
                </ValidatedForm>
            </div>
            <div className='mt-4 text-center'>
                <Link to="/login" className='inline-flex items-center gap-3 px-6 py-2 text-sm italic font-bold uppercase border border-solid border-primary-500'>
                    <ArrowLeftSmall /> back to log in
                </Link>
            </div>
        </div>
    );
}

export default ForgetPasswordForm;