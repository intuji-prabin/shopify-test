import {LoaderFunctionArgs, MetaFunction, json} from '@shopify/remix-oxygen';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {SearchInput} from '~/components/ui/search-input';
import {useColumn} from './use-column';
import {useTable} from '~/hooks/useTable';
import {DataTable} from '~/components/ui/data-table';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {getAllOrders} from './orders.server';

export const meta: MetaFunction = () => {
  return [{title: 'Orders List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const {orderList, orderPageInfo} = await getAllOrders({customerId});

  return json({orderList, orderPageInfo});
}

export default function OrdersPage() {
  const {orderList, orderPageInfo} = useLoaderData<typeof loader>();

  console.log('results', orderList, orderPageInfo);

  const {columns} = useColumn();

  const {table} = useTable(columns, orderList);
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
