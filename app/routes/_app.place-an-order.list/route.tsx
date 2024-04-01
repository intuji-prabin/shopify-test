import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {getUserDetails} from '~/lib/utils/user-session.server';

import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  getPlaceAnOrderList,
  getProductGroupOptions,
} from './place-an-order-list.server';
import {DataTable} from '~/components/ui/data-table';
import {useMyProductColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {useTable} from '~/hooks/useTable';
import {renderSubComponent} from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import {ActionBar} from './action-bar';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {MetaFunction} from '@shopify/remix-oxygen';

const PAGE_LIMIT = 6;

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroupOptions = await getProductGroupOptions({customerId});

  const placeAnOrderList = await getPlaceAnOrderList({customerId});

  return json({productGroupOptions, placeAnOrderList});
}

export default function PlaceAnOrderListPage() {
  const {productGroupOptions, placeAnOrderList} =
    useLoaderData<typeof loader>();

  const {columns} = useMyProductColumn();

  const {table} = useTable(columns, placeAnOrderList.products);
  return (
    <section className="container">
      <ActionBar productGroupOptions={productGroupOptions} table={table} />
      <DataTable
        table={table}
        columns={columns}
        renderSubComponent={renderSubComponent}
      />
      <PaginationWrapper
        pageSize={PAGE_LIMIT}
        totalCount={placeAnOrderList.totalProduct}
      />
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
