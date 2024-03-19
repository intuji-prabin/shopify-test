import {Suspense} from 'react';
import {
  Await,
  defer,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {DeferDataTable} from '~/components/ui/defer-data-table';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {useColumn} from '~/routes/_app.order_.$orderId/use-column';
import OrderSteps from '~/routes/_app.order_.$orderId/order-steps';
import OrderInformation from '~/routes/_app.order_.$orderId/order-information';
import {OrderBreadcrumb} from '~/routes/_app.order_.$orderId/order-breadcrumb';
import OrderNumberDetails from '~/routes/_app.order_.$orderId/order-number-details';
import {getOrdersProductDetails} from '~/routes/_app.order_.$orderId/order-details.server';
import {Separator} from '~/components/ui/separator';

export const meta: MetaFunction = () => {
  return [{title: 'Order Details'}];
};

export async function loader({context, request, params}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const orderId = params.orderId as string;

  const ordersProductDetailsPromise = getOrdersProductDetails({orderId});

  return defer({orderId, ordersProductDetails: ordersProductDetailsPromise});
}

export default function OrderDetailPage() {
  const {orderId, ordersProductDetails} = useLoaderData<typeof loader>();

  const {columns} = useColumn();

  return (
    <section className="container">
      <OrderBreadcrumb orderId={orderId!} />
      <div className="bg-white p-6 flex flex-col gap-6">
        <OrderNumberDetails orderNumber={orderId!} orderStatus="processing" />
        <OrderSteps />
        <OrderInformation />
      </div>
      <div className="bg-white p-2 mt-6">
        {/* Loading Fallback UI needs to be added as per the design */}
        <Suspense fallback={<h1>Loading</h1>}>
          <Await resolve={ordersProductDetails}>
            {(orderProductDetails) => {
              return (
                <>
                  <DeferDataTable
                    columns={columns}
                    tableData={orderProductDetails.products}
                  />
                  <Separator />
                  <div className="flex justify-between px-4 py-6">
                    <article className="space-y-2 bg-primary-50 p-4 border-grey-50 border">
                      <h5>What’s next?</h5>
                      <p className="text-grey-900 font-medium">
                        You product will be delivered on following steps.
                      </p>
                      <p className="text-grey-900 font-medium">
                        Received {'>'} Processing {'>'} Order Picked {'>'}{' '}
                        Dispatched {'>'} In Transit {'>'} Delivered
                      </p>
                    </article>
                    <table className="w-48">
                      <tr>
                        <th className="text-left">Subtotal</th>
                        <td>{`$${orderProductDetails.subTotal}`}</td>
                      </tr>
                      <tr>
                        <th className="text-left">Freight</th>
                        <td>{`$${orderProductDetails.freight}`}</td>
                      </tr>
                      <tr>
                        <th className="text-left">Surcharges</th>
                        <td>{`$${orderProductDetails.surCharges}`}</td>
                      </tr>
                      <tr>
                        <th className="text-left"> Total Excl GST</th>
                        <td>{`$${orderProductDetails.totalExclGst}`}</td>
                      </tr>
                      <tr>
                        <th className="text-left">GST</th>
                        <td>{`$${orderProductDetails.gst}`}</td>
                      </tr>
                      <tr className="leading-7.5 text-[22px]">
                        <th className="text-left">Total</th>
                        <td className="font-bold text-primary-500">{`$${orderProductDetails.totalPrice}`}</td>
                      </tr>
                    </table>
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </section>
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
