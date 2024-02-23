import {z} from 'zod';
import {Link} from '@remix-run/react';
import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm} from 'remix-validated-form';
import {Button} from '~/components/ui/button';
import {DatePickerInput} from '~/components/ui/date-picker';
import {Input} from '~/components/ui/input';
import SelectInput from '~/components/ui/select-input';
import {TextAreaInput} from '~/components/ui/text-area-input';
import {Routes} from '~/lib/constants/routes.constent';

const invoiceStatusOptions = [
  {title: 'paid', value: 'paid'},
  {title: 'unpaid', value: 'unpaid'},
];

const CreateTicketFormFieldSchema = z.object({
  date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {message: 'Date is required'}),
  contactName: z.string().min(1, {message: 'Contact Name is required'}).trim(),
  department: z.string().min(1, {message: 'Department is required'}).trim(),
  reason: z.string().min(1, {message: 'Reason is required'}).trim(),
});

export const CreateTicketFormFieldValidator = withZod(
  CreateTicketFormFieldSchema,
);

export type CreateTicketFormType = z.infer<typeof CreateTicketFormFieldSchema>;

export type CreateTicketFormFieldNameType = keyof CreateTicketFormType;

export function CreateTicketForm() {
  return (
    <div className="bg-neutral-white p-6 grid gap-6 sm:grid-cols-2">
      <div>
        <ValidatedForm
          method="POST"
          validator={CreateTicketFormFieldValidator}
          className="flex flex-col gap-y-4"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              required
              name="contactName"
              label="Contact Name"
              placeholder="Contact Name"
            />
            <div>
              <label htmlFor="department">
                Department <span className="required">*</span>
              </label>
              <SelectInput
                name="department"
                label="Department"
                options={invoiceStatusOptions}
              />
            </div>
          </div>
          <div>
            <label htmlFor="date">
              Date
              <span className="required">*</span>
            </label>
            <DatePickerInput name="date" />
          </div>
          <TextAreaInput
            required
            label="Reason to Impersonate"
            name="reason"
            placeholder="Reason here"
          />
          <div className="flex items-center space-x-4">
            <Button type="submit" variant="primary">
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
        <ul className="list-disc ml-5 mt-4">
          <li>
            Our support staff will contact you to your scheduled date and time
          </li>
          <li>
            You’ll need to clearly explain your problem on the “Reason to
            schedule a call” box
          </li>
          <li className="mb-8">
            If you are having any trouble regarding explaining your problem,
            please try{' '}
            <Link
              to={Routes.SUPPORT_ALLOW_IMPERSONATE}
              className="text-primary-500 font-medium"
            >
              Allow Impersonate
            </Link>{' '}
            option.{' '}
          </li>
        </ul>
      </div>
    </div>
  );
}
