import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {TRACK_AN_ORDERID} from '~/lib/constants/general.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {getNotifications} from '~/routes/_app.notification/notification.server';
import {CustomerData} from '../_public.login/login.server';

export interface CategoriesType {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number | string;
  title: string;
  identifier: string;
  child_categories?: Payload[];
}

export const getOrderId = async (
  context: AppLoadContext,
  request: Request,
  orderNumber: string,
  customerId: string,
) => {
  const customerID = customerId;
  const isImpersonatingCheck = await isImpersonating(request);
  const results = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.ORDERS.GET}/${customerID}?${TRACK_AN_ORDERID}=${orderNumber}`,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });

  if (results?.errors) {
    throw new Error(`Some error has occured, ${results?.errors}`);
  }

  if (!results?.status) {
    throw new Error(`Order Id not found due to ${results?.message}`);
  }

  return results?.payload;
};

export const getCagetoryList = async (context: any) => {
  try {
    const {storefront} = context;
    const catList = await storefront.query(GET_CATEGORY_QUERY);
    const formateCategories = await formateCategory(catList);
    return formateCategories;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error is ', error.message);
      return [];
    }
    console.log('new error', error);
    return [];
  }
};

export const getSessionData = async (
  request: Request,
  userDetails: CustomerData,
  context: AppLoadContext,
) => {
  const isImpersonatingCheck = await isImpersonating(request);
  const sessionData = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.AUTH.SESSION}/${userDetails?.id}`,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });
  if (!sessionData?.status) {
    return false;
  }
  const sessionDataResponse = sessionData?.payload;

  const accessTocken = (await getAccessToken(context)) as string;

  const sessionResponse = await context.storefront.mutate(
    UPDATE_CART_ACCESS_TOCKEN,
    {
      variables: {
        buyerIdentity: {
          customerAccessToken: accessTocken,
        },
        cartId: sessionDataResponse?.cartSessionId,
      },
    },
  );

  return {
    cartDetails: formateCartSessionResponse(sessionResponse, accessTocken),
    productGroup: sessionDataResponse?.productGroup,
    notification: sessionDataResponse?.notification,
    wishlist: sessionDataResponse?.wishlist,
  };
};

const formateCategory = async (categoryesponse: any) => {
  const items = categoryesponse?.collections?.nodes;
  const finalCategories = await items
    .filter((categories: any) => categories?.parent_handle?.value == 'null')
    .map((parentList: any) => ({
      id: parseInt(parentList?.id.replace('gid://shopify/Collection/', '')),
      title: parentList?.title,
      identifier: parentList?.handle,
      child_categories: items.some(
        (category: any) => parentList?.handle == category?.parent_handle?.value,
      )
        ? items
            .filter(
              (category: any) =>
                parentList?.handle === category?.parent_handle?.value,
            )
            .map((childCategory: any) => ({
              id: parseInt(
                childCategory?.id.replace('gid://shopify/Collection/', ''),
              ),
              title: childCategory?.title,
              identifier: childCategory?.handle,
              child_categories: items.some(
                (category: any) =>
                  childCategory?.handle == category?.parent_handle?.value,
              )
                ? items
                    .filter(
                      (category: any) =>
                        childCategory?.handle ===
                        category?.parent_handle?.value,
                    )
                    .map((child: any) => ({
                      id: parseInt(
                        child?.id.replace('gid://shopify/Collection/', ''),
                      ),
                      title: child?.title,
                      identifier: child?.handle,
                      child_categories: [],
                    }))
                : [],
            }))
        : [],
    }));
  return finalCategories;
};

const formateCartSessionResponse = (
  cartResponse: any,
  accessTocken: string,
) => {
  const cartBuyerIdentityUpdate = cartResponse?.cartBuyerIdentityUpdate;
  if (cartBuyerIdentityUpdate?.userErrors.length > 0) {
    return false;
  }
  const cart = cartBuyerIdentityUpdate?.cart;
  const buyerIdentity = cart?.buyerIdentity?.customer;
  const lines = cart?.lines?.nodes;
  const cartListed = {
    cartId: cart?.id,
    customerId: buyerIdentity?.id.replace('gid://shopify/Customer/', ''),
    accessTocken,
    lineItems: 0,
    cartItems: [],
  } as any;

  if (lines.length > 0) {
    lines.map((items: any) => {
      const merchandise = items?.merchandise;
      const variantId = merchandise?.id.replace(
        'gid://shopify/ProductVariant/',
        '',
      );
      const productId = merchandise?.product?.id.replace(
        'gid://shopify/Product/',
        '',
      );
      cartListed.lineItems = cartListed.lineItems + 1;
      cartListed.cartItems.push({
        productId,
        variantId,
        lineId: items?.id,
        quantity: items?.quantity,
        UOM: items?.attributes.filter(
          (att: any) => att?.key == 'selectedUOM',
        )?.[0]?.value,
      });
    });
  }
  return cartListed;
};

export async function getNewNotificationCount({
  context,
  customerId,
  request,
}: {
  context: AppLoadContext;
  customerId: string;
  request: Request;
}) {
  const {searchParams} = new URL(request.url);

  const baseUrl = `${ENDPOINT.NOTIFICATIONS.GET}/${customerId}/new`;

  const url = generateUrlWithParams({baseUrl, searchParams});

  const {totalNotifications} = await getNotifications({
    context,
    request,
    url,
  });
  return {totalNotifications};
}

const GET_CATEGORY_QUERY = `query getCollection {
  collections(first :  250 ) {
      nodes {
          id
          handle
          title
          parent_handle : metafield( key: "parent_slug" namespace: "parent") { value}
      }
  }
  
}` as const;

const UPDATE_CART_ACCESS_TOCKEN =
  `mutation cartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!) {
  cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
    cart {
        id
        buyerIdentity {
            countryCode
            email
            customer {
                id
                email
                firstName
            }
        }
        lines(first : 240 ) {
            nodes {
                id
                quantity
                attributes {
                    key
                    value
                }
                merchandise {
                    __typename
                    ... on ProductVariant {
                      id
                      title
                      product {
                          id
                          handle
                          title
                      }
                  }
                }
            }
        }
    }
    userErrors {
      field
      message
    }
  }
}` as const;
