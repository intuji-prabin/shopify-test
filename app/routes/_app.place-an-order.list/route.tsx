import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {useTable} from '~/hooks/useTable';
import {MetaFunction} from '@shopify/remix-oxygen';
import {DataTable} from '~/components/ui/data-table';
import {Routes} from '~/lib/constants/routes.constent';
import {RouteError} from '~/components/ui/route-error';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {ActionBar} from '~/routes/_app.place-an-order.list/action-bar';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {useMyProductColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {renderSubComponent} from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import {addToCart} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {SelectProductProvider} from '~/routes/_app.pending-order_.$groupId/select-product-context';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  addProductToGroup,
  getPlaceAnOrderList,
  getProductGroupOptions,
} from '~/routes/_app.place-an-order.list/place-an-order-list.server';

const PAGE_LIMIT = 10;

type ActionType = 'add_to_cart';

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroupOptions = await getProductGroupOptions({customerId});

  const {searchParams} = new URL(request.url);

  const placeAnOrderList = await getPlaceAnOrderList({
    customerId,
    searchParams,
  });

  if (placeAnOrderList.totalProduct < 1) {
    return redirect(Routes.PLACE_AN_ORDER);
  }

  return json({productGroupOptions, placeAnOrderList});
}

export async function action({context, request}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const contentType = request.headers.get('Content-Type');

  if (contentType === 'application/json') {
    return await addProductToGroup({
      request,
    });
  }

  const formData = await request.formData();
  const action = formData.get('_action') as ActionType;

  switch (action) {
    case 'add_to_cart': {
      return await addToCart({context, formData, request});
    }
    default:
      throw new Error('Unexpected action');
  }
}

export default function PlaceAnOrderListPage() {
  const {productGroupOptions, placeAnOrderList} =
    useLoaderData<typeof loader>();

  const {columns} = useMyProductColumn({});

  const {table} = useTable(columns, placeAnOrderList.products, 'placeId');
  return (
    <section className="container data__table">
      <SelectProductProvider>
        <ActionBar table={table} productGroupOptions={productGroupOptions} />
      </SelectProductProvider>
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
    return <RouteError />;
  } else if (error instanceof Error) {
    return <RouteError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
