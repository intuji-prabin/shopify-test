import { z } from 'zod';
import { Link } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import { ValidatedForm, useIsSubmitting } from 'remix-validated-form';
import { Button } from '~/components/ui/button';
import { TextAreaInput } from '~/components/ui/text-area-input';
import { Routes } from '~/lib/constants/routes.constent';
import { Switch } from '~/components/ui/switch';
import { useState } from 'react';

const ImpersonateFormFieldSchema = z.object({
  reason: z.string().max(900).trim().optional(),
});

export const ImpersonateFormFieldValidator = withZod(
  ImpersonateFormFieldSchema,
);

export type ImpersonateFormType = z.infer<typeof ImpersonateFormFieldSchema>;

export type ImpersonateFormFieldNameType = keyof ImpersonateFormType;

export function AllowImpersonateForm({
  isImpersonateActive,
}: {
  isImpersonateActive: boolean;
}) {
  const isSubmitting = useIsSubmitting('impersonate-form');
  const [isActive, setIsActive] = useState(isImpersonateActive);

  const handleActiveChange = () =>
    setIsActive((previousState) => !previousState);

  return (
    <div className="grid gap-6 p-6 bg-neutral-white sm:grid-cols-2">
      <div>
        <ValidatedForm
          method="POST"
          id="impersonate-form"
          validator={ImpersonateFormFieldValidator}
        >
          <label htmlFor="allow-impersonate">
            Allow impersonate
            <span className="required">*</span>
          </label>
          <Switch
            type="button"
            checked={isActive}
            onCheckedChange={handleActiveChange}
          />
          <TextAreaInput
            label="Reason to Impersonate"
            name="reason"
            placeholder="Reason here"
          />
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              name="_action"
              value={`${isActive ? 'allow_impersonate' : 'disallow_impersonate'
                }`}
            >
              send
            </Button>
            <p>
              By clicking send, you are granting permission to Cigweld to access
              and work on your account.
            </p>
          </div>
        </ValidatedForm>
      </div>
      <div className="p-6 bg-primary-50">
        <h4>What will happen?</h4>
        <ul className="mt-4 ml-5 list-disc">
          <li>Your data will not be shared with anyone.</li>
          <li>Your data will not be modified or updated.</li>
          <li>
            We will send you a recording of our staff working on your account to
            your email.
          </li>
          <li>You will be contacted if any changes need to be made.</li>
          <li className="mb-8">
            If you are having any trouble with allowing impersonate option,
            please try{' '}
            <Link
              to={Routes.SUPPORT_TICKETS_CREATE}
              className="font-medium text-primary-500"
            >
              Schedule a call
            </Link>{' '}
            option.{' '}
          </li>
        </ul>
      </div>
    </div>
  );
}
