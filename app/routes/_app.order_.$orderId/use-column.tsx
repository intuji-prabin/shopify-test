import {useContext, useMemo} from 'react';
import {Link} from '@remix-run/react';
import {ColumnDef} from '@tanstack/react-table';
import {Routes} from '~/lib/constants/routes.constent';
import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {Product} from '~/routes/_app.order_.$orderId/order-details.server';
import {AbilityContext} from '~/lib/helpers/Can';
import {OrderStatus} from '~/routes/_app.order/order.server';

export function useColumn({
  prefixWithCurrency,
}: {
  prefixWithCurrency(price: string): string;
}) {
  const ability = useContext(AbilityContext);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => {
      const baseColumns: ColumnDef<Product>[] = [
        {
          accessorKey: 'itemLineNumber',
          header: 'iScala Line Item ID',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
        {
          accessorKey: 'name',
          header: 'Product',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
        {
          accessorKey: 'quantity',
          header: 'Ordered Quantity',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
        {
          accessorKey: 'shippedQuantity',
          header: 'Shipped Quantity',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
        {
          accessorKey: 'selectedUOM',
          header: 'UOM',
          enableSorting: false,
          cell: (info) => {
            const uom =
              info.row.original.selectedUOM ?? info.row.original.defaultUOM;
            return uom;
          },
        },
        {
          accessorKey: 'amount',
          header: 'Amount',
          enableSorting: false,
          cell: (info) => {
            const amount = prefixWithCurrency(info.getValue() as string);
            return amount;
          },
        },
        {
          accessorKey: 'shippingStatus',
          header: 'Shipping Status',
          enableSorting: false,
          cell: (info) => {
            const status = info.row.original.shippingStatus as OrderStatus;
            return <OrderStatusChip status={status} />;
          },
        },
        {
          accessorKey: 'invoiceId',
          header: 'Invoice Link',
          enableSorting: false,
          cell: (info) => {
            const invoiceId = info.row.original.invoiceId;
            const invoiceLink = `${Routes.INVOICES}/${invoiceId}`;
            return invoiceId !== '-' ? (
              <Link
                to={invoiceLink}
                prefetch="intent"
                className="text-primary-500 underline text-lg leading-5.5"
              >
                {invoiceId}
              </Link>
            ) : (
              'N/A'
            );
          },
        },
        {
          accessorKey: 'backOrderStatus',
          header: 'Back Order Status',
          enableSorting: false,
          cell: (info) => info.getValue(),
        },
      ];

      // Conditionally add the "Total" column if the user has the ability
      if (ability.can('view', 'view_tracked_order_price')) {
        baseColumns.push({
          accessorKey: 'total',
          header: 'Total',
          enableSorting: false,
          cell: (info) => {
            const totalAmount = prefixWithCurrency(info.getValue() as string);
            return totalAmount;
          },
        });
      }

      return baseColumns;
    },
    [prefixWithCurrency, ability], // Include prefixWithCurrency and ability in the dependencies array
  );

  return {columns};
}
