import { Table } from '@tanstack/react-table';
import { UploadIcon } from '~/components/icons/upload';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Routes } from '~/lib/constants/routes.constent';
import { Order } from '~/routes/_app.order/order.server';
import { useTableRowSelect } from '~/hooks/useTableRowSelect';
import { ENDPOINT } from '~/lib/constants/endpoint.constant';
import { useDownload } from '~/hooks/useDownload';
import { displayToast } from '~/components/ui/toast';

export function ActionBar({
  table,
  customerId,
}: {
  table: Table<Order>;
  customerId: string;
}) {
  const { selectedItem, numberOfSelectedRows } = useTableRowSelect({ table });

  const { handleDownload } = useDownload();

  const handleExport = () => {
    if (numberOfSelectedRows === 0) {
      displayToast({
        message: 'Please select atleast one order to export.',
        type: 'error',
      });
      return;
    }

    const downloadCSVLink = `${ENDPOINT.ORDERS.EXPORT
      }/${customerId}?orderIds=${selectedItem.join(',')}`;

    handleDownload({
      url: downloadCSVLink,
      // api headers here
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
      <div>
        <BackButton title="Orders" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.ORDERS} className="text-grey-900">
            Orders
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex items-center justify-between gap-2">
        {numberOfSelectedRows > 0 && (
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic max-w-[281px] lg:max-w-[unset]">
            {`${numberOfSelectedRows} items `}
          </p>
        )}
        <Button onClick={handleExport}>
          <UploadIcon /> Export
        </Button>
      </div>
    </div>
  );
}
