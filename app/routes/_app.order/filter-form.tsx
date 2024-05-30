import {z} from 'zod';
import {Button} from '~/components/ui/button';
import {ValidatedForm} from 'remix-validated-form';
import {Separator} from '~/components/ui/separator';
import {Link, useSearchParams} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {withZod} from '@remix-validated-form/with-zod';
import {SheetClose, SheetFooter} from '~/components/ui/sheet';
import {DatePickerWithRange} from '~/components/ui/date-range-picker';
import SelectInput, {SelectInputOptions} from '~/components/ui/select-input';

const orderStatusOptions: SelectInputOptions[] = [
  {title: 'Received', value: 'received'},
  {title: 'Processing', value: 'processing'},
  {title: 'Order Picked', value: 'order_picked'},
  {title: 'Dispatch', value: 'dispatched'},
  {title: 'In Transit', value: 'in_transit'},
  {title: 'Invoice Billing', value: 'invoice_billing'},
  {title: 'Delivered', value: 'delivered'},
];

const OrderFilterFormSchema = z.object({
  orderStatus: z.string().trim().optional(),
  orderDateRange: z
    .object({
      orderDateFrom: z.string().trim().optional(),
      orderDateTo: z.string().trim().optional(),
    })
    .optional(),
  estimateDateRange: z
    .object({
      estimateDateFrom: z.string().trim().optional(),
      estimateDateTo: z.string().trim().optional(),
    })
    .optional(),
});

export const OrderFilterFormSchemaValidator = withZod(OrderFilterFormSchema);

export type OrderFilterFormType = z.infer<typeof OrderFilterFormSchema>;

export type OrderFilterFormFieldNameType = keyof OrderFilterFormType;

export default function OrderFilterForm() {
  const [searchParams] = useSearchParams();

  const defaultValues: OrderFilterFormType = {};

  const keys: OrderFilterFormFieldNameType[] = ['orderStatus'];

  keys.forEach((key) => {
    defaultValues[key] = searchParams.get(key) || undefined;
  });

  const orderDateFrom = searchParams.get('orderDateFrom');

  const orderDateTo = searchParams.get('orderDateTo');

  const defaultOrderDateRangeValues = {
    from: orderDateFrom ? new Date(orderDateFrom) : undefined,
    to: orderDateTo ? new Date(orderDateTo) : undefined,
  };

  const estimateDateFrom = searchParams.get('estimateDateFrom');

  const estimateDateTo = searchParams.get('estimateDateTo');

  const defaultEstimateDateRangeValues = {
    from: estimateDateFrom ? new Date(estimateDateFrom) : undefined,
    to: estimateDateTo ? new Date(estimateDateTo) : undefined,
  };

  return (
    <ValidatedForm
      method="GET"
      data-cy="filter-form"
      id="order-filter-form"
      defaultValues={defaultValues}
      validator={OrderFilterFormSchemaValidator}
    >
      <div>
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h5 className="pb-2">Order Date</h5>
            <SheetClose asChild>
              <Link
                to={Routes.ORDERS}
                className="italic text-primary-500 font-bold text-sm leading-6"
              >
                RESET ALL
              </Link>
            </SheetClose>
          </div>
          <DatePickerWithRange
            fromFieldName="orderDateFrom"
            toFieldName="orderDateTo"
            dateRange={defaultOrderDateRangeValues}
          />
        </div>
        <Separator />
        <div className="p-6">
          <h5 className="pb-2">Estimated Delivery Date</h5>
          <DatePickerWithRange
            fromFieldName="estimateDateFrom"
            toFieldName="estimateDateTo"
            dateRange={defaultEstimateDateRangeValues}
          />
        </div>
        <Separator />
        <div className="p-6">
          <div className="">
            <h5 className="pb-2">Order Status</h5>
          </div>
          <SelectInput
            name="orderStatus"
            label="Order Status"
            options={orderStatusOptions}
            data-cy="orderStatus"
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
