import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {DataTable} from '~/components/ui/data-table';
import {useColumn} from '~/routes/_app.support_.tickets/use-column';
import {TicketsData} from '~/routes/_app.support_.tickets/tickets-data';
import {Button} from '~/components/ui/button';
import {HorizontalHamburgerIcon} from '~/components/icons/hamburgerIcon';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {Separator} from '~/components/ui/separator';
import {SearchInput} from '~/components/ui/search-input';
import TicketsFilterForm from '~/routes/_app.support_.tickets/filter-form';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {useTable} from '~/hooks/useTable';

export default function TicketsPage() {
  const {columns} = useColumn();
  const {table} = useTable(columns, TicketsData);
  return (
    <section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Tickets History" />
        <Breadcrumb>
          <BreadcrumbItem href="/support">Support</BreadcrumbItem>
          <BreadcrumbItem href="/support/tickets" className="text-grey-900">
            Tickets
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex items-center justify-between bg-neutral-white p-6 border-b">
        <div className="w-[451px]">
          <SearchInput />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="border-grey-50">
              <HorizontalHamburgerIcon />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="px-4 py-6">
              <SheetTitle className="text-3xl font-bold">Filter</SheetTitle>
            </SheetHeader>
            <Separator className="" />
            <TicketsFilterForm />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable table={table} />
      <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
        <p className="w-40 text-grey-400 font-medium">
          1-7 of {TicketsData.length} Items
        </p>
        <PaginationWrapper pageSize={5} totalCount={TicketsData.length} />
      </div>
    </section>
  );
}
