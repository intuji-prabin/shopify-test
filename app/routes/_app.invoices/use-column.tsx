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
        header: 'Invoice Number',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'salesOrderNo',
        header: 'Sales Order Number',
        enableSorting: false,
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'wareHouseNo',
        header: 'Warehouse Number',
        enableSorting: false,
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
        accessorKey: 'actions',
        header: 'View Invoice',
        enableSorting: false,
        cell: (info) => {
          const invoiceId = info.row.original.invoiceId;
          const fileURL = info.row.original.files;
          const invoiceDetailsRoute = `${Routes.INVOICES}/${invoiceId}`;

          const {handleDownload} = useDownload({
            url: fileURL,
            headers: {'x-api-key': PDF.SECRET_KEY},
          });
          return (
            <div className="flex justify-start gap-x-2">
              <Link to={invoiceDetailsRoute}>
                <Button size="icon" variant="icon">
                  <EyeOn />
                </Button>
              </Link>
              <Button size="icon" variant="icon" onClick={handleDownload}>
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
