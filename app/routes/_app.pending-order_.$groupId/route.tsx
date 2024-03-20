import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import HeroBanner from '~/components/ui/hero-section';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getGroupDetails} from './pending-order-details.server';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import SingleItem from '../_app.single-pending-item/single-item';

import {useTable} from '~/hooks/useTable';
import {useMyProductColumn} from '../_app.cart-list/order-my-products/use-column';
import {renderSubComponent} from '../_app.cart-list/order-my-products/cart-myproduct';
import {DataTable} from '~/components/ui/data-table';

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
export default function PendingOrderDetailsPage() {
  const {groupDetails} = useLoaderData<typeof loader>();
  console.log('groupDetails', groupDetails.products);

  const {columns} = useMyProductColumn();
  const {table} = useTable(columns, groupDetails.products);
  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={groupDetails.groupName}
      />
      <DataTable
        table={table}
        columns={columns}
        renderSubComponent={renderSubComponent}
      />
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
