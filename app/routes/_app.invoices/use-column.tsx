import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {ColumnDef} from '@tanstack/react-table';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {Routes} from '~/lib/constants/routes.constent';
import {Button} from '~/components/ui/button';
import {EyeOn} from '~/components/icons/eye';
import {DownloadIcon} from '~/components/icons/download-icon';
import {Invoices} from '~/routes/_app.invoices/invoices.server';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';
import {useDownload} from '~/hooks/useDownload';
import {PDF} from '~/lib/constants/pdf.constent';
import {OrderStatusChip} from '~/components/ui/order-status-chip';

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
        accessorKey: 'invoiceId',
        header: 'Invoice No.',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'salesOrderNo',
        header: 'Sales Order No.',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'iscalaCompanyId',
        header: 'Company ID',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'wareHouseNo',
        header: 'Warehouse No.',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'invoiceDate',
        header: 'Date',
        cell: (info) =>
          info.getValue()
            ? formatDateToLocaleDateString(info.getValue() as string)
            : 'N/A',
      },
      {
        accessorKey: 'consignmentNo',
        header: 'Consignment No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'deliveryNo',
        header: 'Delivery No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'dispatchDetails',
        header: 'Dispatch Details',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'invoiceAmount',
        header: 'Invoice Amount',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'invoiceStatus',
        header: 'Invoice Status',
        enableSorting: false,
        cell: (info) => {
          const status = info.row.original.invoiceStatus;
          return <OrderStatusChip status={status} />;
        },
      },
      {
        accessorKey: 'poNumber',
        header: 'Purchase Order No.',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'actions',
        header: 'View Invoice',
        enableSorting: false,
        cell: (info) => {
          const invoiceId = info.row.original.invoiceId;
          const fileURL = info.row.original.files;
          const invoiceDetailsRoute = `${Routes.INVOICES}/${invoiceId}`;

          const {handleDownload} = useDownload();

          return (
            <div className="flex justify-start gap-x-2">
              <Link to={invoiceDetailsRoute}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="icon"
                onClick={() =>
                  handleDownload({
                    url: fileURL,
                    headers: {apiKey: PDF.SECRET_KEY},
                  })
                }
              >
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
