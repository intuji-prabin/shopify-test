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
  {label: 'paid', value: 'paid'},
  {label: 'unpaid', value: 'unpaid'},
];

const ScheduleCallFormFieldSchema = z.object({
  date: z.coerce.date({required_error: 'Date is required'}),
  time: z.string().min(1, {message: 'Time is required'}).trim(),
  contactName: z.string().min(1, {message: 'Contact Name is required'}).trim(),
  department: z.string().min(1, {message: 'Department is required'}).trim(),
  reason: z.string().min(1, {message: 'Reason is required'}).trim(),
});

export const ScheduleCallFormFieldValidator = withZod(
  ScheduleCallFormFieldSchema,
);

export type ScheduleCallFormType = z.infer<typeof ScheduleCallFormFieldSchema>;

export type ScheduleCallFormFieldNameType = keyof ScheduleCallFormType;

export function ScheduleCallForm() {
  return (
    <div className="bg-neutral-white p-6 grid gap-6 sm:grid-cols-2">
      <div>
        <ValidatedForm
          method="POST"
          validator={ScheduleCallFormFieldValidator}
          className="flex flex-col gap-y-4"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="date">Date</label>
              <DatePickerInput name="date" />
            </div>
            <Input label="Time" name="time" type="time" placeholder="Time" />
            <Input
              name="contactName"
              label="Contact Name"
              placeholder="Contact Name"
            />
            <div>
              <label htmlFor="department">Department</label>
              <SelectInput
                name="department"
                label="Department"
                options={invoiceStatusOptions}
              />
            </div>
          </div>
          <TextAreaInput
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
