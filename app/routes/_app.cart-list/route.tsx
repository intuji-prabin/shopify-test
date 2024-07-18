import {
  isRouteErrorResponse,
  useActionData,
  useFetcher,
  useLoaderData,
  useNavigation,
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
import useSort from '~/hooks/useSort';
import {
  CART_QUANTITY_MAX,
  CART_SESSION_KEY,
} from '~/lib/constants/cartInfo.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllCompanyShippingAddresses } from '../_app.shipping-address/shipping-address.server';
import { getOrderId } from '../_app/app.server';
import { removeItemFromCart } from './cart-remove.server';
import { cartUpdate } from './cart-update.server';
import { getCartList } from './cart.server';
import MyProducts from './order-my-products/cart-myproduct';
import { placeOrder } from './order-place.server';
import OrderSummary from './order-summary/cart-order-summary';
import { promoCodeApply } from './promoCode.server';
import { promoCodeRemove } from './promoCodeRemove.server';
import { AuthError } from '~/components/ui/authError';

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
  const shippingAddresses = await getAllCompanyShippingAddresses(context, request, customerId, true);
  const cartList = await getCartList(context, request, sessionCartInfo);
  if (cartList?.productList?.length === 0) {
    await getCartList(context, request, sessionCartInfo);
  }
  const finalCartSession = {
    cartId: sessionCartInfo?.cartId,
    lineItems: cartList?.productList?.length,
  };
  await context.session.set(CART_SESSION_KEY, finalCartSession);
  return json(
    { cartList: cartList?.productWithPrice, orderPlaceStatus: cartList?.orderPlaceStatus, frieghtChargeInit: cartList?.frieghtChargeInit, shippingAddresses },
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
      const formData = await request.formData();
      switch (formData.get('action')) {
        case 'place_order': {
          try {
            const poNumber = formData.get('poNumber') as string;
            const { userDetails } = await getUserDetails(request);
            const trackAnOrderResponse = await getOrderId(
              context,
              request,
              poNumber,
              userDetails?.id,
            );

            if (trackAnOrderResponse?.orderList.length > 0) {
              setErrorMessage(
                messageSession,
                'Purchase Order Number or Order Number already taken. Please use another one.',
              );
              return json(
                { status: false, type: "PONO", message: "Purchase Order Number or Order Number already taken. Please use another one." },
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
            const shopifyID = res?.shopifyOrderId
              ? '/' + res?.shopifyOrderId
              : '';

            setSuccessMessage(messageSession, 'Order placed successfully');
            return redirect(Routes.ORDER_SUCCESSFUL + shopifyID, {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            });
          } catch (error) {
            if (error instanceof Error) {
              console.log('this is err', error?.message);
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
        }
        case 'promo_code': {
          console.log("apply code")
          try {
            const promoCode = formData.get('promoCode') as string;
            res = await promoCodeApply(promoCode, context, request);
            setSuccessMessage(messageSession, res?.message);
            return json(
              {},
              {
                headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
              },
            );
          } catch (error) {
            if (error instanceof Error) {
              console.log('this is err', error?.message);
              setErrorMessage(messageSession, error?.message);
              return json(
                { message: error?.message },
                {
                  headers: [
                    ['Set-Cookie', await messageCommitSession(messageSession)],
                  ],
                },
              );
            }
            // console.log('this is err');
            setErrorMessage(
              messageSession,
              'Some issue has occured while applying promocode. Please try again later.',
            );
            return json(
              {},
              {
                headers: [
                  ['Set-Cookie', await messageCommitSession(messageSession)],
                ],
              },
            );
          }
        }
      }
      break;
    case 'DELETE':
      const finalData = await request.formData();
      switch (finalData.get('action')) {
        case 'order_delete': {
          try {
            res = await removeItemFromCart(finalData, context, request);
            await promoCodeRemove(context, request, false);
            setSuccessMessage(messageSession, 'line item removed successfully');
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
              console.log('this is err', error?.message);
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
        }
        case 'promo_code_delete': {
          console.log("remove code")
          try {
            res = await promoCodeRemove(context, request);
            setSuccessMessage(messageSession, res?.message);
            return json(
              {},
              {
                headers: [
                  ['Set-Cookie', await messageCommitSession(messageSession)],
                ],
              },
            );
          } catch (error) {
            if (error instanceof Error) {
              console.log('this is err', error?.message);
              setErrorMessage(messageSession, error?.message);
              return json(
                {},
                {
                  headers: [
                    ['Set-Cookie', await messageCommitSession(messageSession)],
                  ],
                },
              );
            }
            // console.log('this is err');
            setErrorMessage(
              messageSession,
              'Some issue has occured while deleting promocode. Please try again later.',
            );
            return json(
              {},
              {
                headers: [
                  ['Set-Cookie', await messageCommitSession(messageSession)],
                ],
              },
            );
          }
        }
      }
      break;
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
          console.log('this is err', error?.message);
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
  return null;
}

export default function CartList() {
  const { cartList, orderPlaceStatus, shippingAddresses, frieghtChargeInit }: any = useLoaderData<typeof loader>();
  const finalProductList = useSort({ items: cartList?.productList });

  const [updateCart, setUpdateCart] = useState(false);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const fetcher = useFetcher();
  const isLoading = navigation.state === 'submitting' || navigation.state === 'loading' || fetcher.state === 'submitting' || fetcher.state === 'loading';

  return (
    <>
      <HeroBanner imageUrl={'/place-order.png'} sectionName={'SHOPPING CART'} />
      <UploadSearchbar searchVariant="cart" action="/bulkCsvUpload" />
      {finalProductList?.length === 0 ? (
        <EmptyList placeholder="cart" />
      ) : (
        <div className={`container ${isLoading && "loading-state"}`}>
          <div className="flex flex-col flex-wrap items-start gap-6 my-6 xl:flex-row cart__list">
            <MyProducts
              products={finalProductList}
              updateCart={updateCart}
              setUpdateCart={setUpdateCart}
              fetcher={fetcher}
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
              promoCodeApplied={cartList?.promoCode}
              discountPrice={cartList?.discountPrice}
              discountMessage={cartList?.discountMessage}
              totalPriceWithDiscount={cartList?.totalPriceWithDiscount}
              actionData={actionData}
              fetcher={fetcher}
              frieghtCharge={frieghtChargeInit}
              isLoading={isLoading}
              orderPlaceStatus={orderPlaceStatus}
              currencySymbol={cartList?.currencySymbol}
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
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <>
        <HeroBanner imageUrl={'/place-order.png'} sectionName={'SHOPPING CART'} />
        <UploadSearchbar searchVariant="cart" action="/bulkCsvUpload" />
        <EmptyList placeholder='Cart' />
      </>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
