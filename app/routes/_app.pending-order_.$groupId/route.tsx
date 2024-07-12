import { useState } from 'react';
import { Can } from '~/lib/helpers/Can';
import { useTable } from '~/hooks/useTable';
import { DataTable } from '~/components/ui/data-table';
import HeroBanner from '~/components/ui/hero-section';
import { RouteError } from '~/components/ui/route-error';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { ActionBar } from '~/routes/_app.pending-order_.$groupId/action-bar';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { DEFAULT_ERRROR_MESSAGE } from '~/lib/constants/default-error-message.constants';
import { useMyProductColumn } from '~/routes/_app.cart-list/order-my-products/use-column';
import { renderSubComponent } from '~/routes/_app.cart-list/order-my-products/cart-myproduct';
import { SelectProductProvider } from '~/routes/_app.pending-order_.$groupId/select-product-context';
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
  addProductToGroup,
  addToCart,
  deleteGroup,
  deleteGroupProduct,
  getGroupDetails,
  updateGroup,
  updateGroupProduct,
} from '~/routes/_app.pending-order_.$groupId/pending-order-details.server';
import { AuthError } from '~/components/ui/authError';

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
    context,
    request,
    customerId,
    groupId,
    searchParams,
  });

  return json({ groupDetails });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const groupId = Number(params.groupId);

  const { userDetails } = await getUserDetails(request);
  const customerId = userDetails.id.split('/').pop() as string;

  const contentType = request.headers.get('Content-Type');

  if (contentType === 'application/json') {
    return await updateGroupProduct({
      context,
      customerId,
      groupId,
      request,
    });
  }

  const formData = await request.formData();
  const action = formData.get('_action') as ActionType;

  switch (action) {
    case 'update_group': {
      const groupName = formData.get('groupName') as string;

      return await updateGroup({
        context,
        customerId,
        groupId,
        groupName,
        request,
      });
    }

    case 'delete_group': {
      return await deleteGroup({
        context,
        groupId,
        customerId,
        request,
      });
    }

    case 'delete_product': {
      const placeIds = formData
        .getAll('placeId')
        .map((placeId) => Number(placeId));

      return await deleteGroupProduct({
        context,
        customerId,
        groupId,
        placeIds,
        request,
      });
    }

    case 'add_to_cart': {
      return await addToCart({ context, formData, request });
    }

    case 'add_product': {
      const body = JSON.stringify({
        groupId,
        productId: formData.get('productId'),
        quantity: formData.get('quantity'),
        uom: formData.get('uom'),
      });

      return await addProductToGroup({
        context,
        body,
        request,
        customerId,
      });
    }

    default: {
      throw new Error('Unexpected action');
    }
  }
}

export default function PendingOrderDetailsPage() {
  const { groupDetails } = useLoaderData<typeof loader>();

  const [isProductUpdate, setIsProductUpdate] = useState(false);

  const { columns } = useMyProductColumn({ setUpdateCart: setIsProductUpdate });

  const { table } = useTable(columns, groupDetails.products, 'placeId');

  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={groupDetails.groupName}
      />
      <Can I="view" a="search_products">
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
      </Can>
      <section className="container data__table">
        <SelectProductProvider>
          <ActionBar
            setIsProductUpdate={setIsProductUpdate}
            isProductUpdate={isProductUpdate}
            table={table}
            group={groupDetails}
          />
        </SelectProductProvider>
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
    return <RouteError />;
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return <RouteError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
