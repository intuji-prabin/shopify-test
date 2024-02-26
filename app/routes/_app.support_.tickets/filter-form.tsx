import {z} from 'zod';
import {withZod} from '@remix-validated-form/with-zod';
import {ValidatedForm} from 'remix-validated-form';
import {Button} from '~/components/ui/button';
import {DatePickerInput} from '~/components/ui/date-picker';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';
import {Separator} from '~/components/ui/separator';
import {SheetClose, SheetFooter} from '~/components/ui/sheet';

type TicketsFilterFormProps = {
  options: SelectInputOptions[];
};

const ticketsStatusOptions: SelectInputOptions[] = [
  {title: 'Pending', value: 'pending'},
  {title: 'Closed', value: 'closed'},
  {title: 'In Progress', value: 'in_progress'},
];

const TicketsFilterFormSchema = z.object({
  createdDateFrom: z.string().trim().optional(),
  createdDateTo: z.string().trim().optional(),
  department: z.string().trim().optional(),
  status: z.string().trim().optional(),
});

export const TicketsFilterFormSchemaValidator = withZod(
  TicketsFilterFormSchema,
);

export type TicketsFilterFormType = z.infer<typeof TicketsFilterFormSchema>;

export type TicketsFilterFormFieldNameType = keyof TicketsFilterFormType;

export default function TicketsFilterForm({options}: TicketsFilterFormProps) {
  return (
    <ValidatedForm
      id="tickets-filter-form"
      method="GET"
      validator={TicketsFilterFormSchemaValidator}
    >
      <div>
        <div className="p-6">
          <h5 className="pb-2">Created On</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <p className="pb-1">From</p>
              <DatePickerInput name="createdDateFrom" />
            </div>
            <div className="">
              <p className="pb-1">To</p>
              <DatePickerInput name="createdDateTo" />
            </div>
          </div>
        </div>
        <Separator />
        <div className="p-6">
          <h5 className="pb-2">Department</h5>
          <SelectInput name="department" label="All" options={options} />
        </div>
        <Separator />
        <div className="p-6">
          <h5 className="pb-2">Status</h5>
          <SelectInput
            name="status"
            label="Status"
            options={ticketsStatusOptions}
          />
        </div>
      </div>
      <Separator />
      <SheetFooter className="grid grid-cols-2 gap-4 p-6 shadow-top absolute bottom-0 inset-x-0">
        <SheetClose asChild>
          <Button type="button" variant="ghost">
            cancel
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button type="submit" className="">
            apply filter
          </Button>
        </SheetClose>
      </SheetFooter>
    </ValidatedForm>
  );
}
