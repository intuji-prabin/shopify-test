import {LoaderFunctionArgs, MetaFunction, json} from '@shopify/remix-oxygen';
import {useTable} from '~/hooks/useTable';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {UploadIcon} from '~/components/icons/upload';
import {DataTable} from '~/components/ui/data-table';
import {BackButton} from '~/components/ui/back-button';
import {SearchInput} from '~/components/ui/search-input';
import {useColumn} from '~/routes/_app.order/use-column';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import OrderFilterForm from '~/routes/_app.order/filter-form';
import {getAllOrders} from '~/routes/_app.order/order.server';
import PaginationSimple from '~/components/ui/pagination-simple';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {HorizontalHamburgerIcon} from '~/components/icons/hamburgerIcon';
import {Routes} from '~/lib/constants/routes.constent';

export const meta: MetaFunction = () => {
  return [{title: 'Orders List'}];
};

const PAGE_LIMIT = 10;

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const {searchParams} = new URL(request.url);

  const pageNumber = searchParams.get('pageNo') || 1;

  const {orderList, orderPageInfo} = await getAllOrders({
    customerId,
    searchParams,
  });

  return json({orderList, orderPageInfo, pageNumber});
}

export default function OrdersPage() {
  const {orderList, orderPageInfo, pageNumber} = useLoaderData<typeof loader>();

  const {columns} = useColumn();

  const [searchParams] = useSearchParams();

  const {table} = useTable(columns, orderList);

  let isFilterApplied = false;

  for (const [key, value] of searchParams.entries()) {
    if (key === '__rvfInternalFormId' && value === 'order-filter-form') {
      isFilterApplied = true;
    }
  }

  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex items-center justify-between">
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
      <div className="flex gap-2 flex-col bg-neutral-white p-4 border-b sm:flex-row sm:justify-between sm:items-center">
        <div className="sm:w-[451px]">
          <SearchInput />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="border-grey-50 relative">
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

      {orderList.length > 0 && (
        <div className="flex flex-col justify-start w-full gap-3 px-6 py-4 border-t sm:items-center sm:justify-between sm:flex-row bg-neutral-white">
          <PaginationSimple
            pageSize={PAGE_LIMIT}
            page={Number(pageNumber)}
            paginationInfo={orderPageInfo}
            totalLength={orderList.length}
          />
        </div>
      )}
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
