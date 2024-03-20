import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {DataTable} from '~/components/ui/data-table';
import {useTable} from '~/hooks/useTable';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getWishlist} from './wishlist.server';
import {useMyWishListColumn} from './wishlist';
import {useMyProductColumn} from '../_app.cart-list/order-my-products/use-column';
import {BulkTable} from '../_app.cart-list/order-my-products/bulk-table';

export type WishListProductType = {
  productImageUrl: string;
  productName: string;
  sku: string;
  inStock: boolean;
};
export type WishListItem = {
  id: string;
  product: WishListProductType;
  buyPrice: number;
  quantity: number;
  action: string;
};

export const loader = async ({request, context}: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const items = await getWishlist(request);
  return json({items});
};

export default function route() {
  const {columns} = useMyWishListColumn();
  const {items} = useLoaderData<typeof loader>();
  const {table} = useTable(columns, items);
  const tableKey = new Date().getTime();
  console.log('items', items);
  return (
    <div className="container pt-6">
      <h3>Wishlist</h3>
      <section>
        <DataTable
          table={table}
          renderSubComponent={renderSubComponent}
          key={tableKey}
        />
      </section>
    </div>
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
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center ">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

const renderSubComponent = ({row}: any) => {
  return (
    <BulkTable
      product={row.original.priceRange}
      quantity={'Quantity'}
      price={'Price'}
    />
  );
};
