import {z} from 'zod';
import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm, useIsSubmitting} from 'remix-validated-form';
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
  const isSubmitting = useIsSubmitting('resend-activation-link-form');
  return (
    <ValidatedForm
      method="post"
      id="resend-activation-link-form"
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
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isSubmitting}
      >
        RESEND ACTIVATION LINK
      </Button>
    </ValidatedForm>
  );
}
