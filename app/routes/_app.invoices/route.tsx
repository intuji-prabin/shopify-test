import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useTable} from '~/hooks/useTable';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';
import {Button} from '~/components/ui/button';
import {UploadIcon} from '~/components/icons/upload';
import {SearchInput} from '~/components/ui/search-input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {HorizontalHamburgerIcon} from '~/components/icons/hamburgerIcon';
import {Separator} from '~/components/ui/separator';
import OrderFilterForm from '../_app.order/filter-form';
import {DataTable} from '~/components/ui/data-table';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {useColumn} from './use-column';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {Invoices, dummyInvoicesData} from './invoices.server';

export const meta: MetaFunction = () => {
  return [{title: 'Invoices List'}];
};

const PAGE_LIMIT = 10;

export async function loader({request, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  return {invoiceList: dummyInvoicesData};
}
export default function InvoicesPage() {
  const {invoiceList} = useLoaderData<typeof loader>();

  const {columns} = useColumn();

  const [searchParams] = useSearchParams();

  const {table} = useTable(columns, invoiceList);

  let isFilterApplied = false;

  for (const [key, value] of searchParams.entries()) {
    if (key === '__rvfInternalFormId' && value === 'invoice-filter-form') {
      isFilterApplied = true;
    }
  }
  return (
    <section className="container">
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
      <div className="flex flex-col gap-2 p-4 border-b bg-neutral-white sm:flex-row sm:justify-between sm:items-center">
        <div className="sm:w-[451px]">
          <SearchInput />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="relative border-grey-50">
              <HorizontalHamburgerIcon />
              Filter
              {isFilterApplied && (
                <div className="bg-primary-500 h-3 w-3 rounded-full absolute top-0.5 right-0.5"></div>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="px-4 py-6">
              <SheetTitle className="text-3xl font-bold">Filter</SheetTitle>
            </SheetHeader>
            <Separator className="" />
            <OrderFilterForm />
          </SheetContent>
        </Sheet>
      </div>

      <DataTable table={table} columns={columns} />
      <PaginationWrapper pageSize={PAGE_LIMIT} totalCount={12} />
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
