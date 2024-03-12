import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/server-runtime';
import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getMessageSession, messageCommitSession, setSuccessMessage } from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllCompanyShippingAddresses } from '../_app.shipping-address/shipping-address.server';
import { getCartList } from './cart.server';
import MyProducts from './order-my-products/cart-myproduct';
import { placeOrder } from './order-place.server';
import OrderSummary from './order-summary/cart-order-summary';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;
  try {
    let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

    if (!sessionCartInfo) {
      throw new Error('Cart not found');
    }

    const cartList = await getCartList(context, request, sessionCartInfo);
    const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
    // console.log(cartList)
    return json({ cartList, shippingAddresses });
  } catch (error) {
    if (error instanceof Error) {
      console.log('error ', error?.message);
      return json({});
    }
    console.log('error generates ');
    return json({});
  }
};

export async function action({ request, context }: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  try {
    let res;
    switch (request.method) {
      case "POST":
        res = await placeOrder(request, context);
        // context.session.set(res)
        setSuccessMessage(messageSession, "Order successFully creatd");
        return redirect('/', {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        });
      case "PUT":
        res = await request.formData()
        console.log("res", res)
        break;
      default:
        res = json(
          {
            status: false,
            message: `${request.method} not supported`,
            payload: null,
          },
          404,
        );
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(" errerdf ", error?.message)
    }
    console.log(" errerdf ")

  }

  return {};
}

export default function CartList() {
  const { cartList, shippingAddresses }: any = useLoaderData<typeof loader>();
  return (
    <>
      <HeroBanner
        image_url={'/place-order.png'}
        section_name={'SHOPPING CART'}
      />
      <UploadSearchbar />
      <div className="container flex flex-col items-start justify-between gap-6 my-6 lg:flex-row">
        <MyProducts products={cartList?.productList} />
        <OrderSummary
          cartSubTotalPrice={cartList?.cartSubTotalPrice}
          cartTotalPrice={cartList?.cartTotalPrice}
          frieght={cartList?.frieght}
          subcharges={cartList?.subcharges}
          gst={cartList?.gst}
          shippingAddresses={shippingAddresses}
        />
      </div>
    </>
  );
}

