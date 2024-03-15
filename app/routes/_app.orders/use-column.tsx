import {useMemo} from 'react';
import {EyeOn} from '~/components/icons/eye';
import {Button} from '~/components/ui/button';
import {ColumnDef} from '@tanstack/react-table';
import {ReOrder} from '~/components/icons/reorder';
import {statusVariants} from '~/components/ui/status';
import {Order} from '~/routes/_app.orders/orders.server';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';

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
          switch (status) {
            case 'received':
              return 'Received';
            case 'processing':
              return (
                <div className={statusVariants({variant: 'awaiting'})}>
                  Processing
                </div>
              );
            case 'order_picked':
              return 'Order Picked';
            case 'dispatched':
              return 'Dispatched';
            case 'in_transit':
              return (
                <div className={statusVariants({variant: 'partially_shipped'})}>
                  In Transit
                </div>
              );
            case 'delivered':
              return (
                <div className={statusVariants({variant: 'shipped'})}>
                  Delivered
                </div>
              );
            default:
              return 'N/A';
          }
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
          return (
            <div className="flex justify-center gap-x-2">
              <Button size="icon" variant="icon">
                <EyeOn />
              </Button>
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
