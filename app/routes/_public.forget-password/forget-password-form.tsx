import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';
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
    );
}

export default ForgetPasswordForm;