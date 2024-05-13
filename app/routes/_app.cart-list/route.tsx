import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import { useEffect, useState } from 'react';
import EmptyList from '~/components/ui/empty-list';
import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import {
  CART_QUANTITY_MAX,
  CART_SESSION_KEY,
} from '~/lib/constants/cartInfo.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllCompanyShippingAddresses } from '../_app.shipping-address/shipping-address.server';
import { removeItemFromCart } from './cart-remove.server';
import { cartUpdate } from './cart-update.server';
import { getCartList } from './cart.server';
import MyProducts from './order-my-products/cart-myproduct';
import { placeOrder } from './order-place.server';
import OrderSummary from './order-summary/cart-order-summary';
import useSort from '~/hooks/useSort';
import { productBulkCart } from '../_app.categories/bulkOrder.server';
import { getOrderId } from '../_app/app.server';

export const loader = async ({ context, request }: LoaderFunctionArgs) => {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);

  const metaParentValue = userDetails.meta.parent.value;

  const customerId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found');
  }
  const shippingAddresses = await getAllCompanyShippingAddresses(customerId);
  const cartList = await getCartList(context, request, sessionCartInfo);
  if (cartList?.productList?.length === 0) {
    await getCartList(context, request, sessionCartInfo);
  }
  return json(
    { cartList, shippingAddresses },
    {
      headers: [['Set-Cookie', await context.session.commit({})]],
    },
  );
};

export async function action({ request, context }: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  let res;
  switch (request.method) {
    case 'POST':
      try {
        const formData = await request.formData();
        const poNumber = formData.get("poNumber") as string;
        const { userDetails } = await getUserDetails(request);
        const trackAnOrderResponse = await getOrderId(poNumber, userDetails?.id);

        if (trackAnOrderResponse?.orderList.length > 0) {
          setErrorMessage(messageSession, "Purchase Order Number or Order Number already taken. Please use another one.");
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
        res = await placeOrder(formData, request, context);
        // console.log("orderPlacedResponseFInal", res);
        const shopifyID = res?.shopifyOrderId ? '/' + res?.shopifyOrderId : '';

        setSuccessMessage(messageSession, 'Order placed successfully');
        return redirect(Routes.ORDER_SUCCESSFUL + shopifyID, {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        });
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Order not placed to some issue. Please try again later.',
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
    case 'DELETE':
      try {
        res = await removeItemFromCart(context, request);
        setSuccessMessage(messageSession, 'Order deleted successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Order not deleted due to some issue. Please try again later.',
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
    case 'PUT':
      try {
        res = await cartUpdate(context, request);
        setSuccessMessage(messageSession, 'Cart updated successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          // console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
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
        // console.log('this is err');
        setErrorMessage(
          messageSession,
          'Something went wrong during update cart. Please try again later.',
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
}

export default function CartList() {
  const { cartList, shippingAddresses }: any = useLoaderData<typeof loader>();
  const finalProductList = useSort({ items: cartList?.productList });
  const checkQuantityAgainstMOQ = (finalProductList: any) => {
    for (let item of finalProductList) {
      if (
        item.quantity < item.moq ||
        item.quantity > CART_QUANTITY_MAX ||
        item.quantity <= 0
      ) {
        return false;
      }
    }
    return true;
  };
  let result = checkQuantityAgainstMOQ(finalProductList);

  useEffect(() => {
    result = checkQuantityAgainstMOQ(finalProductList);
    setPlaceOrder(result);
  }, [finalProductList]);

  const [updateCart, setUpdateCart] = useState(false);
  const [placeOrder, setPlaceOrder] = useState(result);

  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={'SHOPPING CART'} />
      <UploadSearchbar searchVariant="cart" action="/bulkCsvUpload" />
      {finalProductList?.length === 0 ? (
        <EmptyList />
      ) : (
        <div className="container">
          <div className="flex flex-col flex-wrap items-start gap-6 my-6 xl:flex-row cart__list">
            <MyProducts
              products={finalProductList}
              currency={cartList?.currency}
              updateCart={updateCart}
              setUpdateCart={setUpdateCart}
              setPlaceOrder={setPlaceOrder}
            />
            <OrderSummary
              cartSubTotalPrice={cartList?.cartSubTotalPrice}
              cartTotalPrice={cartList?.cartTotalPrice}
              freight={cartList?.freight}
              surcharges={cartList?.surcharges}
              gst={cartList?.gst}
              currency={cartList?.currency}
              shippingAddresses={shippingAddresses}
              updateCart={updateCart}
              placeOrder={placeOrder}
            />
          </div>
        </div>
      )}
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
      <div className="container pt-6">
        <div className="min-h-[400px] flex justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            <h3>Error has occured</h3>
            <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
              {error?.message}
            </p>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
