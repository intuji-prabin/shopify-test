import {withZod} from '@remix-validated-form/with-zod';
import {ActionFunctionArgs, json} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from 'remix-validated-form';
import {z} from 'zod';
import {zfd} from 'zod-form-data';
import {OtpInput} from '~/components/ui/otp-input';
import Button from '../ui/button-old';

export const validator = withZod(
  z.object({
    opt: zfd.repeatable(z.array(zfd.numeric()).nonempty()),
  }),
);
export async function action({request}: ActionFunctionArgs) {
  const rawFormData = await request.formData();

  const validatedFields = await validator.validate(rawFormData);

  if (validatedFields.error) {
    return validationError(validatedFields.error);
  }

  return json(validatedFields.submittedData);
}

const OtpForm = () => {
  const isSubmitting = useIsSubmitting('otpForm');
  // For otp field
  const [otpError, setOtpError] = useState('');
  return (
    <ValidatedForm
      validator={validator}
      method="post"
      id="otpForm"
      className="space-y-6"
    >
      <OtpInput numberOfDigits={5} name="otp" setOtpError={setOtpError} />
      {otpError && (
        <p className={`text-lg mt-4 ${otpError ? 'error-show' : ''}`}>
          {otpError}
        </p>
      )}
      <Button isDisabled={isSubmitting} size="small" type="submit">
        verify
      </Button>
    </ValidatedForm>
  );
};

export default OtpForm;
