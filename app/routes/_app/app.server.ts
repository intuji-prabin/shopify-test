import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {WISHLIST_SESSION_KEY} from '~/lib/constants/wishlist.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getAccessToken} from '~/lib/utils/auth-session.server';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {PENDING_ORDERS_SESSION_KEY} from '~/lib/constants/pending-orders.constant';

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

export async function getCategories() {
  try {
    const response = await useFetch<CategoriesType>({
      method: AllowedHTTPMethods.GET,
      url: ENDPOINT.CATEGORY.GET,
    });
    if (!response?.status) {
      throw new Error(response?.message);
    }
    return formattedResponse(response);
  } catch (e) {
    if (e instanceof Error) {
      return [];
    }
    return [];
  }
}

const formattedResponse = (response: CategoriesType) => {
  if (!response.payload || response.payload.length < 1) {
    return [];
  }

  const data: Payload[] = response.payload.map((item) => ({
    id: item?.id,
    title: item?.title,
    identifier: item?.identifier,
    child_categories: item?.child_categories,
  }));

  return data;
};

export const getCagetoryList = async (context: any) => {
  try {
    const {storefront} = context;
    const catList = await storefront.query(GET_CATEGORY_QUEYR);
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

export const getSessionData = async (userDetails: any, context: any) => {
  const cartResults = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.AUTH.SESSION}/${userDetails?.id}`,
  });
  if (!cartResults?.status) {
    return false;
  }
  // console.log('dfd ', cartResults?.payload);
  // const sessions = {
  //   totalWishList: cartResults?.payload?.wishlist,
  //   wishItems: [ { id: 8, productId: '9077965127966' } ]
  // }
  await context.session.set(
    WISHLIST_SESSION_KEY,
    cartResults?.payload?.wishlist,
  );
  return true;
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

export const getSessionCart = async (customerId: string, context: any) => {
  const cartResults = await useFetch<any>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.PRODUCT.CART}/${customerId}`,
  });
  if (!cartResults?.status) {
    return false;
  }
  const accessTocken = (await getAccessToken(context)) as string;
  const sessionResponse = await context.storefront.mutate(
    UPDATE_CART_ACCESS_TOCKEN,
    {
      variables: {
        buyerIdentity: {
          customerAccessToken: accessTocken,
        },
        cartId: cartResults?.payload?.sessionId,
      },
    },
  );
  return formateCartSessionResponse(sessionResponse, accessTocken);
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

const GET_CATEGORY_QUEYR = `query getCollection {
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

export async function getPendingOrderSession({
  context,
  customerId,
}: {
  context: AppLoadContext;
  customerId: string;
}) {
  const productGroup = await getProductGroup({customerId});

  context.session.set(PENDING_ORDERS_SESSION_KEY, productGroup?.length);

  return context.session.get(PENDING_ORDERS_SESSION_KEY) as number;
}
