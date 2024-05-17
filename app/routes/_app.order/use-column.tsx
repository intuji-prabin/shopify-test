import {useMemo} from 'react';
import {Link, useFetcher, useSubmit} from '@remix-run/react';
import {EyeOn} from '~/components/icons/eye';
import {Button} from '~/components/ui/button';
import {ColumnDef} from '@tanstack/react-table';
import {ReOrder} from '~/components/icons/reorder';
import {Order} from '~/routes/_app.order/order.server';
import {Routes} from '~/lib/constants/routes.constent';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {Can} from '~/lib/helpers/Can';

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
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'internalOrderNumber',
        header: 'Cigweld Internal Order Number',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'orderDate',
        header: 'Order Date',
        cell: (info) => formatDateToLocaleDateString(info.getValue() as string),
      },
      {
        accessorKey: 'estimatedDate',
        header: 'Estimated Delivery Date',
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
          return <OrderStatusChip status={status} />;
        },
      },
      {
        accessorKey: 'orderBy',
        header: 'Order By',
        cell: (info) => {
          const orderBy = info.getValue() as string;
          return <span className="capitalize">{orderBy}</span>;
        },
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: (info) => {
          const orderId = info.row.original.id;

          const orderDetailsRoute = `${Routes.ORDERS}/${orderId}`;

          const lineItems = info.row.original.lineItems;

          const fetcher = useFetcher();

          const handleReOrder = () => {
            const formData = new FormData();

            lineItems.map((item, index) => {
              formData.append(
                `${item.productId + index}_productId`,
                item.productId,
              );

              formData.append(
                `${item.productId + index}_variantId`,
                item.variantId!,
              );

              formData.append(
                `${item.productId + index}_quantity`,
                item.quantity.toString(),
              );

              formData.append(`${item.productId + index}_uom`, item.uom);

              formData.append('bulkCart', 'true');

              formData.append('_action', 'add_to_cart');

              fetcher.submit(formData, {method: 'POST'});
            });
          };
          return (
            <div className="flex justify-center gap-x-2">
              <Link to={orderDetailsRoute}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
              <Can I="view" a="reorder_order">
                <Button
                  size="icon"
                  variant={
                    fetcher.state === 'submitting' || fetcher.state !== 'idle'
                      ? 'disabled'
                      : 'icon'
                  }
                  onClick={handleReOrder}
                >
                  <ReOrder />
                </Button>
              </Can>
            </div>
          );
        },
      },
    ],
    [],
  );
  return {columns};
}
