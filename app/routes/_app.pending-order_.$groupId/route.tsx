import { useTable } from '~/hooks/useTable';
import { DataTable } from '~/components/ui/data-table';
import HeroBanner from '~/components/ui/hero-section';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { ActionBar } from '~/routes/_app.pending-order_.$groupId/action-bar';
import { Routes } from '~/lib/constants/routes.constent';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { addedBulkCart } from '~/routes/_app.wishlist/bulk.cart.server';
import { useMyProductColumn } from '~/routes/_app.cart-list/order-my-products/use-column';
import { renderSubComponent } from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  addProductToGroup,
  deleteGroup,
  deleteGroupProduct,
  getGroupDetails,
  updateGroup,
} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Pending Order Details' }];
};

type ActionType =
  | 'update_group'
  | 'delete_group'
  | 'delete_product'
  | 'add_to_cart'
  | 'add_product';

const PAGE_LIMIT = 10;

export async function loader({ context, request, params }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const groupId = params.groupId as string;

  const { searchParams } = new URL(request.url);

  const groupDetails = await getGroupDetails({
    customerId,
    groupId,
    searchParams,
  });

  return json({ groupDetails });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  const formData = await request.formData();

  const action = formData.get('_action') as ActionType;

  const groupId = Number(params.groupId);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  switch (action) {
    case 'update_group': {
      try {
        const groupName = formData.get('groupName') as string;

        const updatedGroup = await updateGroup({
          customerId,
          groupId,
          groupName,
        });

        setSuccessMessage(messageSession, updatedGroup.message);

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await messageCommitSession(messageSession),
            },
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            { error },
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({ error }, { status: 500 });
      }
    }

    case 'delete_group': {
      try {
        const deletedGroup = await deleteGroup({
          groupId,
          customerId,
        });

        setSuccessMessage(messageSession, deletedGroup.message);

        return redirect(Routes.PENDING_ORDER, {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            { error },
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({ error }, { status: 500 });
      }
    }

    case 'delete_product': {
      try {
        const body = JSON.stringify({
          groupId,
          productIds: formData.getAll('productIds'),
        });

        const deletedProduct = await deleteGroupProduct({
          body,
          customerId,
        });

        setSuccessMessage(messageSession, deletedProduct.message);

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await messageCommitSession(messageSession),
            },
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            { error },
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({ error }, { status: 500 });
      }
    }

    case 'add_to_cart': {
      try {
        const cartInfo = Object.fromEntries(formData);

        const accessTocken = (await getAccessToken(context)) as string;

        await addedBulkCart(cartInfo, context, accessTocken, request);

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

    case 'add_product': {
      try {
        const body = JSON.stringify({
          groupId,
          productId: formData.get('productId'),
          quantity: formData.get('quantity'),
          uom: formData.get('uom'),
        });

        const productResponse = await addProductToGroup({
          body,
          customerId,
        });

        setSuccessMessage(messageSession, productResponse.message);

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await messageCommitSession(messageSession),
            },
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            { error },
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({ error }, { status: 500 });
      }
    }

    default: {
      throw new Error('Unexpected action');
    }
  }
}

export default function PendingOrderDetailsPage() {
  const { groupDetails } = useLoaderData<typeof loader>();

  const { columns } = useMyProductColumn();

  const { table } = useTable(columns, groupDetails.products);

  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={groupDetails.groupName}
      />
      <div className=" bg-primary-500">
        <div className="container flex items-center gap-6 py-6">
          <div className="search-bar flex bg-white items-center min-w-[unset] w-full px-4 py-3 xl:min-w-[453px] max-h-14 relative">
            <PredictiveSearch
              searchVariant="pending_order"
              inputPlaceholder="Rapid Product Search..."
            />
          </div>
        </div>
      </div>
      <section className="container data__table">
        <ActionBar groupName={groupDetails.groupName} table={table} />
        <DataTable
          table={table}
          columns={columns}
          renderSubComponent={renderSubComponent}
        />
        <PaginationWrapper
          pageSize={PAGE_LIMIT}
          totalCount={groupDetails.totalProduct}
        />
      </section>
    </>
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
