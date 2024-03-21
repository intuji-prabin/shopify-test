import {useTable} from '~/hooks/useTable';
import {DataTable} from '~/components/ui/data-table';
import HeroBanner from '~/components/ui/hero-section';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {ActionBar} from '~/routes/_app.pending-order_.$groupId/action-bar';
import {useMyProductColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {renderSubComponent} from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@shopify/remix-oxygen';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  deleteGroupProduct,
  getGroupDetails,
  updateGroupDetails,
} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';

export const meta: MetaFunction = () => {
  return [{title: 'Pending Order Details'}];
};

export async function loader({context, request, params}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const groupId = params.groupId as string;

  const groupDetails = await getGroupDetails({customerId, groupId});

  return json({groupDetails});
}

export async function action({request, context, params}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  const formData = await request.formData();

  const action = formData.get('_action') as 'update' | 'delete' | 'add_to_cart';

  const groupId = Number(params.groupId);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  switch (action) {
    case 'update': {
      try {
        const groupName = formData.get('groupName') as string;

        const updatedGroup = await updateGroupDetails({
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
            {error},
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({error}, {status: 500});
      }
    }
    case 'delete': {
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
            {error},
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({error}, {status: 500});
      }
    }
    case 'add_to_cart': {
      // API integration for add to cart
      break;
    }
    default: {
      throw new Error('Unexpected action');
    }
  }
}
export default function PendingOrderDetailsPage() {
  const {groupDetails} = useLoaderData<typeof loader>();

  const {columns} = useMyProductColumn();

  const {table} = useTable(columns, groupDetails.products);

  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={groupDetails.groupName}
      />
      <section className="container">
        <ActionBar groupName={groupDetails.groupName} table={table} />

        <DataTable
          table={table}
          columns={columns}
          renderSubComponent={renderSubComponent}
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
