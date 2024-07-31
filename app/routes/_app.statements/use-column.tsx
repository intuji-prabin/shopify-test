import {Link} from '@remix-run/react';
import {ColumnDef} from '@tanstack/react-table';
import {useMemo} from 'react';
import {DownloadIcon} from '~/components/icons/download-icon';
import {EyeOn} from '~/components/icons/eye';
import {Button} from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import {useDownload} from '~/hooks/useDownload';
import {PDF} from '~/lib/constants/pdf.constent';
import {formatDateToLocaleDateString} from '~/lib/helpers/dateTime.helper';

export function useColumn(
  sessionAccessTocken: string,
  impersonateEnableCheck: string,
) {
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'statementCode',
        header: 'Statement No.',
        cell: (info) => info.getValue() ?? 'N/A',
      },
      {
        accessorKey: 'statementDateTime',
        header: 'Date',
        cell: (info) =>
          info.getValue()
            ? formatDateToLocaleDateString(info.getValue() as string)
            : 'N/A',
      },
      {
        accessorKey: 'actions',
        header: 'View Statement',
        enableSorting: false,
        cell: (info) => {
          const statementId = info.row.original.id;
          const fileURL = info.row.original.files;
          const invoiceDetailsRoute = `/statement/${statementId}`;

          const {handleDownload, loading} = useDownload();

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
                className={`${loading && 'pointer-events-none'}`}
                onClick={() =>
                  handleDownload({
                    url: fileURL,
                    headers: {
                      apiKey: PDF.SECRET_KEY,
                      Authorization: sessionAccessTocken,
                      'Impersonate-Enable': impersonateEnableCheck,
                    },
                  })
                }
              >
                {loading ? <Loader /> : <DownloadIcon />}
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
