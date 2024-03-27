import {Link, json, useLoaderData} from '@remix-run/react';
import {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {OrderSuccessfull} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';

export const meta: MetaFunction = () => {
  return [{title: 'Order Successfull'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const userName = `${userDetails.firstName} ${userDetails.lastName}`;

  return json({userName});
}

export default function OrderSuccessPage() {
  const {userName} = useLoaderData<typeof loader>();

  return (
    <section className="max-w-[538px] bg-white flex flex-col mx-auto justify-center items-center gap-6 py-6">
      <figure className="bg-semantic-success-100 rounded-[50%] h-12 w-12 flex items-center justify-center">
        <OrderSuccessfull />
      </figure>
      <div className="flex flex-col gap-6">
        <h3>Your order has been successfully placed</h3>
        <div className="flex flex-col items-center">
          <p>{userName}, thank you for your order!</p>
          <p>
            We’ve received your order and will contact your via email address.
          </p>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Button variant="primary">
          <Link to={Routes.ORDERS}>track order</Link>
        </Button>
        <Button variant="ghost">
          <Link to={Routes.CATEGORIES}>All products</Link>
        </Button>
      </div>
    </section>
  );
}
