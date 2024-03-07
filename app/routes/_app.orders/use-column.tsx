import {ColumnDef} from '@tanstack/react-table';
import {useMemo} from 'react';
import {EyeOn} from '~/components/icons/eye';
import {ReOrder} from '~/components/icons/reorder';
import {Button} from '~/components/ui/button';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';

type orderStatus =
  | 'received'
  | 'processing'
  | 'order_picked'
  | 'dispatched'
  | 'in_transit'
  | 'delivered';

export type OrderColumn = {
  id: string;
  customerPurchaseOrderNumber: string;
  cigweldInternalOrderNumber: string;
  orderDate: string;
  estimatedDeliveryDate: string;
  orderStatus: string;
  orderBy: string;
};

export function useColumn() {
  const columns = useMemo<ColumnDef<OrderColumn>[]>(
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
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'customerPurchaseOrderNumber',
        header: 'Customer Purchase Order Number',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'cigweldInternalOrderNumber',
        header: 'Cigweld Internal Order Number',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'orderDate',
        header: 'Order Date',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'estimatedDeliveryDate',
        header: 'Estimated Delivery Date',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'orderStatus',
        header: 'Order Status',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'orderBy',
        header: 'Order By',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
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
