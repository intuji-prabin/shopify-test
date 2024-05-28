import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm} from 'remix-validated-form';
import {z} from 'zod';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';

const ResendActivationLinkFormFieldSchema = z.object({
  email: z
    .string()
    .min(1, {message: 'Email is required'})
    .email({message: 'Must be a valid email'}),
});

export const ResendActivationLinkFormFieldValidator = withZod(
  ResendActivationLinkFormFieldSchema,
);

export type ResendActivationLinkFormType = z.infer<
  typeof ResendActivationLinkFormFieldSchema
>;

export type ResendActivationLinkFormFieldNameType =
  keyof ResendActivationLinkFormType;

export default function ResendActivationLinkForm() {
  return (
    <ValidatedForm
      method="post"
      validator={ResendActivationLinkFormFieldValidator}
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
      </div>
      <Button type="submit" variant="primary" className="w-full">
        RESEND ACTIVATION LINK
      </Button>
    </ValidatedForm>
  );
}
