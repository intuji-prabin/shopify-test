import {useFetcher, useSubmit} from '@remix-run/react';
import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm, useField, useIsValid} from 'remix-validated-form';
import {z} from 'zod';
import {DangerAlert} from '~/components/icons/alert';
import {Button} from '~/components/ui/button';
import {DialogClose} from '~/components/ui/dialog';
import {Label} from '~/components/ui/label';

const ConfirmationFormSchema = z.object({
  customerId: z.string().trim(),
  confirmation: z.enum(['Deactivate'], {
    errorMap: (issue, ctx) => ({message: 'You must type Deactivate'}),
  }),
});

export const ConfirmationFormSchemaValidator = withZod(ConfirmationFormSchema);

export default function ConfirmationForm({
  customerId,
  setIsOpen,
}: {
  customerId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const submit = useSubmit();
  const isConfirm = useIsValid('confirmation-form');

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ValidatedForm
        method="post"
        validator={ConfirmationFormSchemaValidator}
        id="confirmation-form"
        onSubmit={(_, event) => {
          submit(event.currentTarget);
          handleClick();
        }}
      >
        <input type="hidden" name="customerId" value={customerId} />
        <Label className="text-lg font-normal leading-5.5 normal-case pb-4">
          To confirm deactivation, type “Deactivate” below
        </Label>
        <ConfirmationInput name="confirmation" placeholder="type deactivate" />
        <div className="flex justify-end items-center space-x-2 pt-4">
          <DialogClose asChild>
            <Button type="button" className="uppercase" variant="ghost">
              cancel
            </Button>
          </DialogClose>

          <Button
            type="submit"
            className="uppercase"
            name="_action"
            value="deactivate"
            variant="primary"
            disabled={!isConfirm}
          >
            deactivate user
          </Button>
        </div>
      </ValidatedForm>
    </>
  );
}

function ConfirmationInput({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) {
  const {error, getInputProps} = useField(name);
  return (
    <>
      <div className="relative">
        <input
          {...getInputProps({id: name})}
          placeholder={placeholder}
          className={`${error && 'invalid'} w-full`}
        />
      </div>
      {error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </>
  );
}
