import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@shopify/remix-oxygen';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import OrderSteps from '~/routes/_app.order_.$orderId/order-steps';
import OrderInformation from '~/routes/_app.order_.$orderId/order-information';
import { OrderBreadcrumb } from '~/routes/_app.order_.$orderId/order-breadcrumb';
import OrderNumberDetails from '~/routes/_app.order_.$orderId/order-number-details';
import { getOrdersProductDetails } from '~/routes/_app.order_.$orderId/order-details.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { ProductTable } from '~/routes/_app.order_.$orderId/product-table';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { addedBulkCart } from '~/routes/_app.wishlist/bulk.cart.server';
import { Routes } from '~/lib/constants/routes.constent';
import { useMemo } from 'react';
import { BackButton } from '~/components/ui/back-button';
import { RouteError } from '~/components/ui/route-error';
import { OrderInformationError } from '~/routes/_app.order_.$orderId/order-information-error';
import { AuthError } from '~/components/ui/authError';

export const meta: MetaFunction = () => {
  return [{ title: 'Order Details' }];
};

export async function loader({ context, request, params }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);
  const customerId = userDetails.id;
  const orderId = params.orderId as string;

  const ordersProductDetails = await getOrdersProductDetails({
    context,
    request,
    orderId,
    customerId,
  });

  return json({ orderId, ordersProductDetails });
}

export async function action({ request, context }: ActionFunctionArgs) {
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
          if (error.message.includes('does not exist')) {
            setErrorMessage(
              messageSession,
              'You can not reorder this item as it does not exist in the store anymore.',
            );
          } else {
            setErrorMessage(messageSession, error.message);
          }
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

export default function OrderDetailPage() {
  const { orderId, ordersProductDetails } = useLoaderData<typeof loader>();
  const { products, ...rest } = ordersProductDetails;

  const displayOrderSteps =
    ordersProductDetails.orderStatus !== 'Order Cancel' &&
    ordersProductDetails.orderStatus !== 'On Hold';

  const productWithNoBackOrderStatus = useMemo(() => {
    return products.filter((product) => product.backOrderStatus !== 'No');
  }, [products]);

  return (
    <section className="container">
      <OrderBreadcrumb orderId={orderId} products={products} />
      <div className="flex flex-col gap-6 p-6 bg-white">
        {ordersProductDetails.errorStatus ? (
          <OrderInformationError
            errorMessage={ordersProductDetails.errorMessage}
          />
        ) : (
          <>
            <OrderNumberDetails
              orderNumber={orderId}
              iscalaOrderId={ordersProductDetails.iscalaOrderId}
              orderStatus={ordersProductDetails.orderStatus}
            />

            {displayOrderSteps && (
              <OrderSteps
                orderStatus={ordersProductDetails.orderStatus}
                products={productWithNoBackOrderStatus}
              />
            )}

            <OrderInformation orderInformation={rest} />
          </>
        )}
      </div>

      <ProductTable orderProductDetails={ordersProductDetails} />
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <div className="pt-6 pb-4">
          <BackButton title="Order Details" />
        </div>
        <RouteError />
      </section>
    );
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <section className="container">
        <div className="pt-6 pb-4">
          <BackButton title="Order Details" />
        </div>
        <RouteError errorMessage={error.message} />
      </section>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
