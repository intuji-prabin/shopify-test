import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {ColumnDef} from '@tanstack/react-table';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {Routes} from '~/lib/constants/routes.constent';
import {Button} from '~/components/ui/button';
import {EyeOn} from '~/components/icons/eye';
import {DownloadIcon} from '~/components/icons/download-icon';
import {Invoices} from '~/routes/_app.invoices/invoices.server';

export function useColumn() {
  const columns = useMemo<ColumnDef<Invoices>[]>(
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
        accessorKey: 'invoiceNumber',
        header: 'Invoice No',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'poNumber',
        header: 'Customer Purchase Order No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'deliveryNumber',
        header: 'Delivery No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'dispatchDetails',
        header: 'Dispatch Details',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'consignmentNumber',
        header: 'Consignment No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'actions',
        header: 'View Invoice',
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
                <DownloadIcon />
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
