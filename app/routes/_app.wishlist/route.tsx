import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { DataTable } from '~/components/ui/data-table';
import { useTable } from '~/hooks/useTable';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import { BulkTable } from '../_app.cart-list/order-my-products/bulk-table';
import { useMyWishListColumn } from './wishlist';
import { getWishlist } from './wishlist.server';
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from '~/lib/utils/toast-session.server';
import { addProductToCart } from '../_app.product_.$productSlug/product.server';

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

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const items = await getWishlist(request);
  return json({ items });
};

export const action = async ({ request, context }: LoaderFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const formData = await request.formData();
  try {
    const cartInfo = Object.fromEntries(formData);
    const accessTocken = (await getAccessToken(context)) as string;
    const addToCart = await addProductToCart(
      cartInfo,
      accessTocken,
      context,
      request,
    );
    setSuccessMessage(messageSession, 'Item added to cart successfully');
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log('this is err', error?.message);
      setErrorMessage(messageSession, error?.message);
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    }
    console.log('this is err');
    setErrorMessage(
      messageSession,
      'Item not added to cart. Please try again later.',
    );
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  }
}

export default function route() {
  const { columns } = useMyWishListColumn();
  const { items } = useLoaderData<typeof loader>();
  const { table } = useTable(columns, items);
  const tableKey = new Date().getTime();
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

const renderSubComponent = ({ row }: any) => {
  return (
    <BulkTable
      product={row.original.priceRange}
      quantity={'Quantity'}
      price={'Price'}
    />
  );
};
