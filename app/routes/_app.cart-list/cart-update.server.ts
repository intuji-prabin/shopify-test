import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {CONSTANT} from '~/lib/constants/product.session';
import {getCartList} from './cart.server';

export const cartUpdate = async (context: any, request: any) => {
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);

  if (!sessionCartInfo) {
    throw new Error('Cart not found on session. This is session issue.');
  }

  const formData = await request.formData();
  const allFormData = Object.fromEntries(formData);
  const keyList = Object.keys(allFormData);
  const productId = [] as any;
  const formateData = keyList.map((key: any) => {
    const keySplit = key.split('_');
    if (key != 'quantity' && key != 'uomSelector') {
      if (!productId.some((item: any) => item == keySplit[0])) {
        productId.push(keySplit[0]);
      }
    }
    return true;
  });

  const itemData = productId.map((id: any) => {
    const data = {
      attributes: [
        {
          key: 'selectedUOM',
          value: allFormData[`${id}_uom`],
        },
      ],
      id: allFormData[`${id}_lineItemId`],
      merchandiseId: `${CONSTANT?.variantId}${
        allFormData[`${id}_productVariant`]
      }`,
      quantity: parseInt(allFormData[`${id}_quantity`]),
    };

    console.log('data', data);
    return data;
  });
  console.log('firstitemData', itemData);
  return;
  const cartUpdateResponse = await context.storefront.mutate(UPDATE_CART, {
    variables: {
      cartId: sessionCartInfo?.cartId,
      lines: itemData,
    },
  });
  // await getCartList(context, request, cartSession);
  const cartLinesUpdate = cartUpdateResponse?.cartLinesUpdate;

  if (cartLinesUpdate?.userErrors.length > 0) {
    throw new Error('Somthing went wrong during update cart.');
  }

  const cart = cartLinesUpdate?.cart;

  if (!cart) {
    throw new Error('Cart not found during update.');
  }

  const lines = cart?.lines?.nodes;
  if (lines.length < 1) {
    throw new Error('Cart item not found during update cart');
  }
  await getCartList(context, request, sessionCartInfo);
  return true;
};

const UPDATE_CART =
  `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!){
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
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
          lines(first : 10 ) {
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
