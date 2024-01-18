import {useFetcher} from '@remix-run/react';
import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm, useField, useIsValid} from 'remix-validated-form';
import {z} from 'zod';
import {DangerAlert} from '~/components/icons/alert';
import {Button} from '~/components/ui/button';
import {DialogClose} from '~/components/ui/dialog';
import {Label} from '~/components/ui/label';

export const validator = withZod(
  z.object({
    confirmation: z.enum(['deactivate'], {
      errorMap: (issue, ctx) => ({message: 'You must type deactivate'}),
    }),
  }),
);

export default function ConfirmationForm({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const fetcher = useFetcher();
  const isConfirm = useIsValid('confirmation-form');

  const handleClick = () => {
    console.log('deactivated');
    setIsOpen(false);
  };
  return (
    <>
      <ValidatedForm
        fetcher={fetcher}
        method="post"
        validator={validator}
        id="confirmation-form"
      >
        <Label className="text-lg font-normal leading-5.5 normal-case pb-4">
          To confirm deactivation, type “deactivate” below
        </Label>
        <ConfirmationInput name="confirmation" placeholder="type deactivate" />
      </ValidatedForm>
      <div className="flex justify-end items-center space-x-2 pt-4">
        <DialogClose asChild>
          <Button className="uppercase" variant="ghost">
            cancel
          </Button>
        </DialogClose>

        <Button
          className="uppercase"
          variant="primary"
          disabled={!isConfirm}
          onClick={handleClick}
        >
          deactivate user
        </Button>
      </div>
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
