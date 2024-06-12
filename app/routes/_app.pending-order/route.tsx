import {
  json,
  useLoaderData
} from '@remix-run/react';
import { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import HeroBanner from '~/components/ui/hero-section';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { ProductGroupCardGrid } from '~/routes/_app.pending-order/order-cards';
import { getProductGroup } from '~/routes/_app.pending-order/pending-order.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Pending Order' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroup = await getProductGroup({ context, request, customerId });

  return json({ productGroup });
}
export default function PendingOrderPage() {
  const { productGroup } = useLoaderData<typeof loader>();

  const sectionName = `Pending Order (${productGroup?.length}/10 Group Cards)`;
  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={sectionName} />
      <ProductGroupCardGrid productGroupList={productGroup} />
    </>
  );
}
