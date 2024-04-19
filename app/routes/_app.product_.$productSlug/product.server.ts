import {useFetch} from '~/hooks/useFetch';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {CONSTANT} from '~/lib/constants/product.session';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {GET_CART_LIST} from '../_app.cart-list/cart.server';
import {useFormatCart} from '~/hooks/useFormatCart';

export async function getProductDetails(customerId: string, handle: string) {
  try {
    const results: any = await fetch(
      `${ENDPOINT.PRODUCT.GET_PRODUCT}/${customerId}/${handle}`,
      {
        method: 'GET',
      },
    );
    const response = await results.json();
    if (response?.errors) {
      throw new Error('Something went wrong');
    }
    if (!response?.status) {
      throw new Error(response?.message);
    }
    return response.payload;
  } catch (error) {
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}

export const addProductToCart = async (
  cartInfo: any,
  accessTocken: string,
  context: any,
  request: any,
  cartItems = [],
) => {
  // console.log('cartInfo', cartInfo);
  if (cartItems.length < 0) {
    if (!cartInfo.productId) {
      throw new Error(
        'Product Id is not present so, this product cannot be added to the cart.',
      );
    }
    if (!cartInfo.productVariantId) {
      throw new Error(
        'Product Variant is not present so, this product cannot be added to the cart.',
      );
    }
    if (!cartInfo.selectUOM) {
      throw new Error(
        'Product UOM is not present so, this product cannot be added to the cart.',
      );
    }
  }
  const {session} = context;
  const sessionCartInfo = session.get(CART_SESSION_KEY);
  if (!sessionCartInfo) {
    const cartSetInfo = await setNewCart(
      context,
      accessTocken,
      cartInfo,
      cartItems,
    );
    console.log('cartSetInfo', cartSetInfo);
    const finalCartSet = useFormatCart(cartSetInfo);
    session.set(CART_SESSION_KEY, finalCartSet);
    const storeCartId = await storeCartIdOnBackend(
      request,
      cartSetInfo?.cartId,
    );
    return cartSetInfo;
  }

  const cartLineAddResponse = await cartLineAdd(
    context,
    cartInfo,
    sessionCartInfo,
    cartItems,
  );
  const finalCartLine = useFormatCart(cartLineAddResponse);
  //  session.unset( CART_SESSION_KEY)
  session.set(CART_SESSION_KEY, finalCartLine);
  const cartLists = await context.storefront.query(GET_CART_LIST, {
    variables: {cartId: sessionCartInfo?.cartId},
  });
  // console.log('asfsfwerewr cartLists ', cartLists);
  // console.log('asfsfwerewr cartListssss nodes ', cartLists?.cart?.lines?.nodes);
  return true;
};

const setNewCart = async (
  context: any,
  accessTocken: string,
  cartInfo: any,
  cartItems = [],
) => {
  const {storefront} = context;
  const responses = await storefront.mutate(SET_NEW_CART, {
    variables: cartFormateVariable(cartInfo, accessTocken, cartItems),
  });
  const formateResponse = cartResponseFormate(responses, accessTocken);
  // console.log('radfs ', responses);
  // console.log('radfs ', responses?.cartCreate?.userErrors[0]);
  return formateResponse;
};

const updateAllReadyAddedCart = async (
  context: any,
  accessTocken: any,
  cartInfo: any,
  sessionCartInfo: any,
) => {
  const {storefront} = context;
  const updateCartResponse = await storefront.mutate(UPDATE_OLD_CART, {
    variables: cartUpdateFormateVariable(sessionCartInfo, cartInfo),
  });
  if (!updateCartResponse) {
    throw new Error('Cart not updated');
  }
  // console.log('cartLinesUpdate ', updateCartResponse?.cartLinesUpdate);
  if (updateCartResponse?.cartLinesUpdate?.userErrors.length > 0) {
    throw new Error(
      updateCartResponse?.cartLinesUpdate?.userErrors[0]?.message,
    );
  }
  const lines = updateCartResponse?.cartLinesUpdate?.cart?.lines?.nodes;
  // console.log('linews ', lines);
  if (lines.length < 1) {
    throw new Error('You cart system is wrong');
  }
  sessionCartInfo.lineItems = 0;
  lines.map((items: any) => {
    const merchandise = items?.merchandise;
    const variantId = merchandise?.id.replace(CONSTANT?.variantId, '');
    const productId = merchandise?.product?.id.replace(CONSTANT?.productId, '');
    sessionCartInfo.lineItems = sessionCartInfo.lineItems + 1;
    sessionCartInfo[productId] = {
      productId,
      variantId,
      lineId: items?.id,
      quantity: items?.quantity,
      UOM: items?.attributes.filter(
        (att: any) => att?.key == 'selectedUOM',
      )?.[0]?.value,
    };
  });

  return sessionCartInfo;
};

const cartLineAdd = async (
  context: any,
  cartInfo: any,
  sessionCartInfo: any,
  cartItems = [],
) => {
  const {storefront} = context;
  const addItemInCartresponses = await storefront.mutate(ADD_ITEMS_IN_CART, {
    variables: cartAddLineFormateVariable(cartInfo, sessionCartInfo, cartItems),
  });
  if (!addItemInCartresponses) {
    throw new Error('Cart not updated');
  }
  if (addItemInCartresponses?.cartLinesAdd?.userErrors.length > 0) {
    throw new Error(
      addItemInCartresponses?.cartLinesAdd?.userErrors[0]?.message,
    );
  }
  const lines = addItemInCartresponses?.cartLinesAdd?.cart?.lines?.nodes;
  if (lines.length < 1) {
    throw new Error('You cart system is wrong');
  }
  sessionCartInfo.lineItems = 0;
  sessionCartInfo.cartItems = [];
  lines.map((items: any) => {
    const merchandise = items?.merchandise;
    const variantId = merchandise?.id.replace(CONSTANT?.variantId, '');
    const productId = merchandise?.product?.id.replace(CONSTANT?.productId, '');
    sessionCartInfo.lineItems = sessionCartInfo.lineItems + 1;
    sessionCartInfo.cartItems.push({
      productId,
      variantId,
      lineId: items?.id,
      quantity: items?.quantity,
      UOM: items?.attributes.filter(
        (att: any) => att?.key == 'selectedUOM',
      )?.[0]?.value,
    });
  });

  return sessionCartInfo;
};

const storeCartIdOnBackend = async (request: any, cartId: string) => {
  const {userDetails} = await getUserDetails(request);
  // console.log('cartId ', cartId);
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.PRODUCT.CART}/${customerId}`,
      body: JSON.stringify({cartId}),
    });
    // console.log('ssss ', results);
    return true;
  } catch (error) {
    return true;
  }
};

const cartResponseFormate = (cartResponse: any, accessTocken: string) => {
  if (!cartResponse) {
    throw new Error('Cart not added');
  }
  const cartCreate = cartResponse?.cartCreate;
  if (cartCreate?.userErrors.length > 0) {
    throw new Error(cartCreate?.userErrors[0]?.message);
  }
  const cart = cartCreate?.cart;
  const buyerIdentity = cart?.buyerIdentity?.customer;
  const lines = cart?.lines?.nodes;
  const cartListed = {
    cartId: cart?.id,
    customerId: buyerIdentity?.id.replace(CONSTANT?.customer, ''),
    accessTocken,
    lineItems: 0,
    cartItems: [],
  } as any;

  if (lines.length > 0) {
    lines.map((items: any) => {
      const merchandise = items?.merchandise;
      const variantId = merchandise?.id.replace(CONSTANT?.variantId, '');
      const productId = merchandise?.product?.id.replace(
        CONSTANT?.productId,
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

const cartFormateVariable = (
  cartInfo: any,
  accessTocken: string,
  cartItems = [],
) => {
  const variantId = `${CONSTANT?.variantId}${cartInfo?.productVariantId}`;
  return {
    input: {
      attributes: [
        {
          key: 'cigweldCart',
          value: 'Cigweld Cart',
        },
      ],
      buyerIdentity: {
        customerAccessToken: accessTocken,
      },
      lines:
        cartItems.length > 0
          ? cartItems
          : [
              {
                attributes: [
                  {
                    key: 'selectedUOM',
                    value: cartInfo?.selectUOM,
                  },
                ],
                merchandiseId: variantId,
                quantity: parseInt(cartInfo?.quantity),
              },
            ],
      metafields: [
        {
          key: 'cart',
          type: 'string',
          value: 'cart testing',
        },
      ],
      note: 'cigweld team note',
    },
  };
};

const cartUpdateFormateVariable = (sessionCartInfo: any, cartInfo: any) => {
  const setCartData = sessionCartInfo?.[cartInfo?.productId];
  // console.log('setCartData ', setCartData, setCartData?.lineId);
  return {
    cartId: sessionCartInfo?.cartId,
    lines: [
      {
        id: setCartData?.lineId,
        quantity: parseInt(cartInfo?.quantity),
        merchandiseId: `${CONSTANT?.variantId}${cartInfo?.productVariantId}`,
        attributes: [
          {
            key: 'selectedUOM',
            value: cartInfo?.selectUOM,
          },
        ],
      },
    ],
  };
};

const cartAddLineFormateVariable = (
  cartInfo: any,
  sessionCartInfo: any,
  cartItems = [],
) => {
  const variantId = `${CONSTANT?.variantId}${cartInfo?.productVariantId}`;
  return {
    cartId: sessionCartInfo?.cartId,
    lines:
      cartItems.length > 0
        ? cartItems
        : [
            {
              attributes: [
                {
                  key: 'selectedUOM',
                  value: cartInfo?.selectUOM,
                },
              ],
              merchandiseId: variantId,
              quantity: parseInt(cartInfo?.quantity),
            },
          ],
  };
};

export const SET_NEW_CART = `mutation cartCreate( $input : CartInput) {
  cartCreate( input: $input) {
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
      code
    }
  }
}` as const;

const UPDATE_OLD_CART =
  `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
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

export const ADD_ITEMS_IN_CART =
  `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
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
