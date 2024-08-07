import {Table} from '@tanstack/react-table';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import {displayToast} from '~/components/ui/toast';
import {useDownload} from '~/hooks/useDownload';
import {useTableRowSelect} from '~/hooks/useTableRowSelect';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {Invoices} from '~/routes/_app.invoices/invoices.server';

export function ActionBar({
  table,
  customerId,
  sessionAccessTocken,
  impersonateEnableCheck,
}: {
  table: Table<Invoices>;
  customerId: string;
  sessionAccessTocken: string;
  impersonateEnableCheck: string;
}) {
  const {selectedItem, numberOfSelectedRows} = useTableRowSelect({table});

  const {handleDownload, loading} = useDownload();

  const handleExport = () => {
    if (numberOfSelectedRows === 0) {
      displayToast({
        message: 'Please select atleast one invoice to export.',
        type: 'error',
      });
      return;
    }

    const downloadInvoicePDFLink = `${
      ENDPOINT.INVOICE.EXPORT
    }/${customerId}?invoiceIds=${selectedItem.join(',')}`;

    handleDownload({
      url: downloadInvoicePDFLink,
      headers: {
        Authorization: sessionAccessTocken,
        'Impersonate-Enable': impersonateEnableCheck,
      },
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
      <div>
        <BackButton title="Invoices" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.INVOICES} className="text-grey-900">
            Invoices
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex items-center justify-between gap-2">
        {numberOfSelectedRows > 0 && (
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] lg:max-w-[unset]">
            {`${numberOfSelectedRows} ${
              numberOfSelectedRows > 1 ? 'Items' : 'Item'
            } `}
          </p>
        )}
        <Button
          onClick={handleExport}
          className={`${loading && 'pointer-events-none'}`}
        >
          {loading ? <Loader /> : <UploadIcon />} Export
        </Button>
      </div>
    </div>
  );
}
