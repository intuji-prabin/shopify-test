import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {GET_CART_LIST} from './cart.server';
import {
  ADD_ITEMS_IN_CART,
  SET_NEW_CART,
} from '../_app.product_.$productSlug/product.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';

export const cartUpdate = async (
  cartInfo: any,
  accessTocken: string,
  context: any,
  request: any,
) => {
  if (!cartInfo.productId) {
    throw new Error(
      'Product Id is not present so, this product cannot be added to the cart.',
    );
  }
  if (!cartInfo.productVeriantId) {
    throw new Error(
      'Product Variant is not present so, this product cannot be added to the cart.',
    );
  }
  if (!cartInfo.selectUOM) {
    throw new Error(
      'Product UOM is not present so, this product cannot be added to the cart.',
    );
  }
  const {session} = context;
  const sessionCartInfo = session.get(CART_SESSION_KEY);
  if (!sessionCartInfo) {
    const cartSetInfo = await setNewCart(context, accessTocken, cartInfo);
    session.set(CART_SESSION_KEY, cartSetInfo);
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
  );
  session.set(CART_SESSION_KEY, cartLineAddResponse);
  const cartLists = await context.storefront.query(GET_CART_LIST, {
    variables: {cartId: sessionCartInfo?.cartId},
  });
  return true;
};

const setNewCart = async (
  context: any,
  accessTocken: string,
  cartInfo: any,
) => {
  const {storefront} = context;
  const responses = await storefront.mutate(SET_NEW_CART, {
    variables: cartFormateVariable(cartInfo, accessTocken),
  });
  const formateResponse = cartResponseFormate(responses, accessTocken);
  return formateResponse;
};

const storeCartIdOnBackend = async (request: any, cartId: string) => {
  const {userDetails} = await getUserDetails(request);
  try {
    const customerId = userDetails?.id;
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.PRODUCT.CART}/${customerId}`,
      body: JSON.stringify({cartId}),
    });
    return true;
  } catch (error) {
    return true;
  }
};

const cartLineAdd = async (
  context: any,
  cartInfo: any,
  sessionCartInfo: any,
) => {
  const {storefront} = context;
  const addItemInCartresponses = await storefront.mutate(ADD_ITEMS_IN_CART, {
    variables: cartAddLineFormateVariable(cartInfo, sessionCartInfo),
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
    const veriantId = merchandise?.id.replace(
      'gid://shopify/ProductVariant/',
      '',
    );
    const productId = merchandise?.product?.id.replace(
      'gid://shopify/Product/',
      '',
    );
    sessionCartInfo.lineItems = sessionCartInfo.lineItems + 1;
    sessionCartInfo.cartItems.push({
      productId,
      veriantId,
      lineId: items?.id,
      quantity: items?.quantity,
      UOM: items?.attributes.filter(
        (att: any) => att?.key == 'selectedUOM',
      )?.[0]?.value,
    });
  });

  return sessionCartInfo;
};

const cartFormateVariable = (cartInfo: any, accessTocken: string) => {
  const variantId = `gid://shopify/ProductVariant/${cartInfo?.productVeriantId}`;
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
      lines: [
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
    customerId: buyerIdentity?.id.replace('gid://shopify/Customer/', ''),
    accessTocken,
    lineItems: 0,
    cartItems: [],
  } as any;

  if (lines.length > 0) {
    lines.map((items: any) => {
      const merchandise = items?.merchandise;
      const veriantId = merchandise?.id.replace(
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
        veriantId,
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

const cartAddLineFormateVariable = (cartInfo: any, sessionCartInfo: any) => {
  const variantId = `gid://shopify/ProductVariant/${cartInfo?.productVeriantId}`;
  return {
    cartId: sessionCartInfo?.cartId,
    lines: [
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
