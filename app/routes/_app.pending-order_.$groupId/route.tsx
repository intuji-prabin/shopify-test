import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@shopify/remix-oxygen';
import HeroBanner from '~/components/ui/hero-section';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {
  getGroupDetails,
  updateGroupDetails,
} from './pending-order-details.server';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';

import {useTable} from '~/hooks/useTable';
import {useMyProductColumn} from '../_app.cart-list/order-my-products/use-column';

import {DataTable} from '~/components/ui/data-table';
import {renderSubComponent} from '../_app.cart-list/order-my-products/cart-myproduct';
import {ActionBar} from './action-bar';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
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

  const action = formData.get('_action') as string;

  switch (action) {
    case 'edit': {
      try {
        const groupId = Number(params.groupId);

        const groupName = formData.get('groupName') as string;

        const {userDetails} = await getUserDetails(request);

        const customerId = userDetails.id.split('/').pop() as string;

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
