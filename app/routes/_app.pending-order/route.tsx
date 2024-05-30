import HeroBanner from '~/components/ui/hero-section';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {ProductGroupCardGrid} from '~/routes/_app.pending-order/order-cards';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {RouteError} from '~/components/ui/route-error';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export const meta: MetaFunction = () => {
  return [{title: 'Pending Order'}];
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroup = await getProductGroup({customerId});

  return json({productGroup});
}
export default function PendingOrderPage() {
  const {productGroup} = useLoaderData<typeof loader>();

  const sectionName = `Pending Order (${productGroup?.length}/10 Group Cards)`;
  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={sectionName} />
      <ProductGroupCardGrid productGroupList={productGroup} />
    </>
  );
}
