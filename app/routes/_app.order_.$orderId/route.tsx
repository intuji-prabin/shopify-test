import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import OrderTopDetail from '../_app.order-details/orderTopDetail';

export const meta: MetaFunction = () => {
  return [{title: 'Order Details'}];
};

export async function loader({context, request, params}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const orderId = params.orderId;

  return json({orderId});
}

export default function OrderDetailPage() {
  const {orderId} = useLoaderData<typeof loader>();

  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex items-center justify-between">
        <div>
          <BackButton title="Order Details" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.ORDERS}>Order</BreadcrumbItem>
            <BreadcrumbItem className="text-grey-900">{orderId}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="flex gap-2 items-center">
          <p className="text-lg italic font-bold leading-[22p-x]">6 items</p>
          <Button variant="primary">re-order</Button>
        </div>
      </div>
      <div className="bg-white p-6 flex flex-col gap-6">
        <OrderTopDetail orderNumber={orderId!} orderStatus="processing" />
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
