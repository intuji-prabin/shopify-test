import {Table} from '@tanstack/react-table';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {useTableRowSelect} from '~/hooks/useTableRowSelect';
import {Routes} from '~/lib/constants/routes.constent';
import {Invoices} from '~/routes/_app.invoices/invoices.server';

export function ActionBar({table}: {table: Table<Invoices>}) {
  const {selectedItem, numberOfSelectedRows} = useTableRowSelect({table});

  console.log('selectedItem', selectedItem, numberOfSelectedRows);

  return (
    <div className="flex items-center justify-between pt-6 pb-4 ">
      <div>
        <BackButton title="Invoices" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.INVOICES} className="text-grey-900">
            Invoices
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <Button>
        <UploadIcon /> Export
      </Button>
    </div>
  );
}
