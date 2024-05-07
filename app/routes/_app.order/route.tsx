import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@shopify/remix-oxygen';
import {useTable} from '~/hooks/useTable';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {DataTable} from '~/components/ui/data-table';
import {SearchInput} from '~/components/ui/search-input';
import {useColumn} from '~/routes/_app.order/use-column';
import {getAccessToken, isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import OrderFilterForm from '~/routes/_app.order/filter-form';
import {LineItem, getAllOrders} from '~/routes/_app.order/order.server';
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
import {ActionBar} from '~/routes/_app.order/action-bar';
import { useConditionalRender } from '~/hooks/useAuthorization';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {addedBulkCart} from '../_app.wishlist/bulk.cart.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
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

  const {orderList, totalOrder} = await getAllOrders({
    customerId,
    searchParams,
  });

  return json({orderList, totalOrder});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  const formData = await request.formData();

  const action = formData.get('_action') as 'add_to_cart';

  switch (action) {
    case 'add_to_cart': {
      try {
        const cartInfo = Object.fromEntries(formData);

        const accessTocken = (await getAccessToken(context)) as string;

        await addedBulkCart(cartInfo, context, accessTocken, request);

        setSuccessMessage(messageSession, 'Item has been reorder successfully');

        return redirect(Routes.CART_LIST, {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        });
      } catch (error) {
        if (error instanceof Error) {
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
        setErrorMessage(
          messageSession,
          'Item could not reorder. Please try again later.',
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

    default: {
      throw new Error('Unexpected action');
    }
  }
}

export default function OrdersPage() {
  const {orderList, totalOrder} = useLoaderData<typeof loader>();

  const {columns} = useColumn();

  const [searchParams] = useSearchParams();

  const {table} = useTable(columns, orderList, 'poNumber');

  let isFilterApplied = false;

  for (const [key, value] of searchParams.entries()) {
    if (key === '__rvfInternalFormId' && value === 'order-filter-form') {
      isFilterApplied = true;
    }
  }
  const shouldRender = useConditionalRender('view_orders');


  return (
    shouldRender && (<section className="container">
      <ActionBar table={table} />
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

      <PaginationWrapper pageSize={PAGE_LIMIT} totalCount={totalOrder} />
    </section>)
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
