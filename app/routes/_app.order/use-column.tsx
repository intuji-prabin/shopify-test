import {useMemo} from 'react';
import {Link} from '@remix-run/react';
import {EyeOn} from '~/components/icons/eye';
import {Button} from '~/components/ui/button';
import {ColumnDef} from '@tanstack/react-table';
import {ReOrder} from '~/components/icons/reorder';
import {Order} from '~/routes/_app.order/order.server';
import {Routes} from '~/lib/constants/routes.constent';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {OrderStatusChip} from '~/components/ui/order-status-chip';

export function useColumn() {
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        id: 'select',
        header: ({table}) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({row}) => (
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
      },
      {
        accessorKey: 'poNumber',
        header: 'Customer Purchase Order Number',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'internalOrderNumber',
        header: 'Cigweld Internal Order Number',
        enableSorting: false,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'orderDate',
        header: 'Order Date',
        cell: (info) => formatDateToLocaleDateString(info.getValue() as string),
      },
      {
        accessorKey: 'estimatedDate',
        header: 'Estimated Delivery Date',
        enableSorting: false,
        cell: (info) =>
          info.getValue()
            ? formatDateToLocaleDateString(info.getValue() as string)
            : 'N/A',
      },
      {
        accessorKey: 'orderStatus',
        header: 'Order Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.orderStatus;
          <OrderStatusChip status={status} />;
        },
      },
      {
        accessorKey: 'orderBy',
        header: 'Order By',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => {
          const orderId = info.row.original.id;

          const orderDetailsRoute = `${Routes.ORDERS}/${orderId}`;

          return (
            <div className="flex justify-center gap-x-2">
              <Link to={orderDetailsRoute}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
              <Button size="icon" variant="icon">
                <ReOrder />
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );
  return {columns};
}
