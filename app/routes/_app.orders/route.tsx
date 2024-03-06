import {MetaFunction} from '@shopify/remix-oxygen';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {SearchInput} from '~/components/ui/search-input';
import {useColumn} from './use-column';
import {useTable} from '~/hooks/useTable';
import {DataTable} from '~/components/ui/data-table';
import ArrowUp from '~/components/icons/arrowUp';
import ArrowDown from '~/components/icons/arrowDown';
import {dummyOrderData} from './data';

export const meta: MetaFunction = () => {
  return [{title: 'Orders List'}];
};

export default function OrdersPage() {
  const {columns} = useColumn();
  const {table} = useTable(columns, dummyOrderData);
  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex items-center justify-between">
        <div>
          <BackButton title="Orders" />
          <Breadcrumb>
            <BreadcrumbItem>Accounts</BreadcrumbItem>
            <BreadcrumbItem href="/orders" className="text-grey-900">
              Orders
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Button>
          <UploadIcon /> Export
        </Button>
      </div>
      <div className="flex gap-2 flex-col bg-neutral-white p-4 border-b sm:flex-row sm:justify-between sm:items-center">
        <div className="sm:w-[451px]">
          <SearchInput />
        </div>
      </div>
      <DataTable table={table} columns={columns} />
    </section>
  );
}
