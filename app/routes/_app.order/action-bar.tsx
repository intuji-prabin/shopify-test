import {Table} from '@tanstack/react-table';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import {Order} from '~/routes/_app.order/order.server';
import {useTableRowSelect} from '~/hooks/useTableRowSelect';

export function ActionBar({table}: {table: Table<Order>}) {
  const {selectedItem, numberOfSelectedRows} = useTableRowSelect({table});

  console.log('seelctedItem', selectedItem, numberOfSelectedRows);

  return (
    <div className="flex items-center justify-between pt-6 pb-4 ">
      <div>
        <BackButton title="Orders" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.ORDERS} className="text-grey-900">
            Orders
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Button>
        <UploadIcon /> Export
      </Button>
    </div>
  );
}
