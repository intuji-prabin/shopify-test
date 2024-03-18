import {z} from 'zod';
import {Link} from 'react-router-dom';
import {Button} from '~/components/ui/button';
import {useSearchParams} from '@remix-run/react';
import {ValidatedForm} from 'remix-validated-form';
import {Separator} from '~/components/ui/separator';
import {Routes} from '~/lib/constants/routes.constent';
import {withZod} from '@remix-validated-form/with-zod';
import {SheetClose, SheetFooter} from '~/components/ui/sheet';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';
import {DatePickerWithRange} from '~/components/ui/date-range-picker';

type TicketsFilterFormProps = {
  options: SelectInputOptions[];
};

const ticketsStatusOptions: SelectInputOptions[] = [
  {title: 'Closed', value: 'closed'},
  {title: 'Pending', value: 'pending'},
  {title: 'In Progress', value: 'in_progress'},
];

const TicketsFilterFormSchema = z.object({
  departmentId: z.string().trim().optional(),
  status: z.string().trim().optional(),
  dateRange: z
    .object({
      createdDateFrom: z.string().trim().optional(),
      createdDateTo: z.string().trim().optional(),
    })
    .optional(),
});

export const TicketsFilterFormSchemaValidator = withZod(
  TicketsFilterFormSchema,
);

export type TicketsFilterFormType = z.infer<typeof TicketsFilterFormSchema>;

export type TicketsFilterFormFieldNameType = keyof TicketsFilterFormType;

export default function TicketsFilterForm({options}: TicketsFilterFormProps) {
  const [searchParams] = useSearchParams();

  const defaultValues: TicketsFilterFormType = {};

  const keys: TicketsFilterFormFieldNameType[] = ['status', 'departmentId'];

  keys.forEach((key) => {
    defaultValues[key] = searchParams.get(key) || undefined;
  });

  const createdDateFrom = searchParams.get('createdDateFrom');

  const createdDateTo = searchParams.get('createdDateTo');

  const defaultRangeValues = {
    from: createdDateFrom ? new Date(createdDateFrom) : undefined,
    to: createdDateTo ? new Date(createdDateTo) : undefined,
  };

  return (
    <ValidatedForm
      method="GET"
      data-cy="filter-form"
      id="tickets-filter-form"
      defaultValues={defaultValues}
      validator={TicketsFilterFormSchemaValidator}
    >
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h5 className="pb-2">Schedule On</h5>
            <SheetClose asChild>
              <Link
                to={Routes.SUPPORT_TICKETS}
                className="italic text-primary-500 font-bold text-sm leading-6"
              >
                RESET ALL
              </Link>
            </SheetClose>
          </div>
          <DatePickerWithRange
            fromFieldName="createdDateFrom"
            toFieldName="createdDateTo"
            dateRange={defaultRangeValues}
          />
        </div>
        <Separator />
        <div className="p-6">
          <h5 className="pb-2">Department</h5>
          <SelectInput name="departmentId" label="All" options={options} />
        </div>
        <Separator />
        <div className="p-6">
          <div className="">
            <h5 className="pb-2">Status</h5>
          </div>
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
          <Button
            type="submit"
            data-cy="apply-filter"
            className="whitespace-nowrap"
          >
            apply filter
          </Button>
        </SheetClose>
      </SheetFooter>
    </ValidatedForm>
  );
}
