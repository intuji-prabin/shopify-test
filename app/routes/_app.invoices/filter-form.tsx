import {z} from 'zod';
import {Button} from '~/components/ui/button';
import {ValidatedForm} from 'remix-validated-form';
import {Separator} from '~/components/ui/separator';
import {withZod} from '@remix-validated-form/with-zod';
import {Link, useSearchParams} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {SheetClose, SheetFooter} from '~/components/ui/sheet';
import {DatePickerWithRange} from '~/components/ui/date-range-picker';

const InvoicesFilterFormSchema = z.object({
  invoiceDateRange: z
    .object({
      invoiceDateFrom: z.string().trim().optional(),
      invoiceDateTo: z.string().trim().optional(),
    })
    .optional(),
});

export const InvoicesFilterFormSchemaValidator = withZod(
  InvoicesFilterFormSchema,
);

export type InvoicesFilterFormType = z.infer<typeof InvoicesFilterFormSchema>;

export type InvoicesFilterFormFieldNameType = keyof InvoicesFilterFormType;

export default function InvoicesFilterForm() {
  const [searchParams] = useSearchParams();

  const invoiceDateFrom = searchParams.get('invoiceDateFrom');

  const invoiceDateTo = searchParams.get('invoiceDateTo');

  const defaultInvoiceDateRangeValues = {
    from: invoiceDateFrom ? new Date(invoiceDateFrom) : undefined,
    to: invoiceDateTo ? new Date(invoiceDateTo) : undefined,
  };

  return (
    <ValidatedForm
      method="GET"
      id="invoice-filter-form"
      validator={InvoicesFilterFormSchemaValidator}
    >
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h5 className="pb-2">Invoice Date</h5>
            <SheetClose asChild>
              <Link
                to={Routes.INVOICES}
                className="italic text-primary-500 font-bold text-sm leading-6"
              >
                RESET ALL
              </Link>
            </SheetClose>
          </div>
          <DatePickerWithRange
            fromFieldName="invoiceDateFrom"
            toFieldName="invoiceDateTo"
            dateRange={defaultInvoiceDateRangeValues}
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
