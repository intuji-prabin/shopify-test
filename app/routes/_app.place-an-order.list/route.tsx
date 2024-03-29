import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import OrderTable from '../_app.place-an-order/order-table';
import {getUserDetails} from '~/lib/utils/user-session.server';

import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {useLoaderData} from '@remix-run/react';
import {getProductGroupOptions} from './place-an-order-list.server';

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const productGroupOptions = await getProductGroupOptions({customerId});

  return json({productGroupOptions});
}
export default function PlaceAnOrderListPage() {
  const {productGroupOptions} = useLoaderData<typeof loader>();
  return <OrderTable productGroupOptions={productGroupOptions} />;
}
