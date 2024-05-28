import {
  CART_QUANTITY_MAX,
  CART_SESSION_KEY,
} from '~/lib/constants/cartInfo.constant';
import {CONSTANT} from '~/lib/constants/product.session';
import {getCartList} from './cart.server';
import {useFormatCart} from '~/hooks/useFormatCart';
import {promoCodeRemove} from './promoCodeRemove.server';

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
    return {
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
  });

  // Initialize an object to store cumulative quantities for each merchandiseId
  const merchandiseQuantities = {} as any;

  // Iterate through the cart items
  itemData.forEach((item: any) => {
    // Check if the merchandiseId exists in the merchandiseQuantities object
    if (merchandiseQuantities[item.merchandiseId]) {
      // If it exists, add the quantity to the existing cumulative quantity
      merchandiseQuantities[item.merchandiseId] += item.quantity;
    } else {
      // If it doesn't exist, initialize the cumulative quantity with the item's quantity
      merchandiseQuantities[item.merchandiseId] = item.quantity;
    }
  });

  // Iterate through the merchandiseQuantities object to check if any cumulative quantity exceeds 999999
  for (const merchandiseId in merchandiseQuantities) {
    if (merchandiseQuantities[merchandiseId] > 999999) {
      // If it does, log the error message
      console.log('Error has occurred');
      throw new Error(
        `The quantity exceeds ${CART_QUANTITY_MAX} while updating the cart`,
      );
    }
  }

  // const mergeDuplicateItems = (itemData: any) => {
  //   const mergedItems: any = {};

  //   itemData.forEach((item: any) => {
  //     const key = item.merchandiseId + '-' + item.attributes[0].value;

  //     if (!mergedItems[key]) {
  //       mergedItems[key] = {...item};
  //     } else {
  //       mergedItems[key].quantity += item.quantity;
  //     }
  //   });

  //   const mergedItemList = Object.values(mergedItems);

  //   // Check if any merged item's quantity exceeds 999999 i.e CART_QUANTITY_MAX
  //   const hasExceededLimit = mergedItemList.some(
  //     (item: any) => item.quantity > CART_QUANTITY_MAX,
  //   );

  //   if (hasExceededLimit) {
  //     throw new Error(
  //       `The quantity exceeds ${CART_QUANTITY_MAX} while updating the cart`,
  //     );
  //   }

  //   return mergedItemList;
  // };

  const cartUpdateResponse = await context.storefront.mutate(UPDATE_CART, {
    variables: {
      cartId: sessionCartInfo?.cartId,
      lines: itemData,
    },
  });

  const cartLinesUpdate = cartUpdateResponse?.cartLinesUpdate;

  if (cartLinesUpdate?.userErrors.length > 0) {
    throw new Error('Something went wrong during update cart.');
  }
  const cart = cartLinesUpdate?.cart;

  if (!cart) {
    throw new Error('Cart not found during update.');
  }

  const lines = cart?.lines?.nodes;
  if (lines.length < 1) {
    throw new Error('Cart item not found during update cart');
  }

  const cartSession = {
    ...sessionCartInfo,
    cartItems: [],
    lineItems: lines.length,
  };
  const finalCartSession = useFormatCart(cartSession);
  context.session.set(CART_SESSION_KEY, finalCartSession);
  await getCartList(context, request, cartSession);
  return {cartSession};
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
          lines(first : 250 ) {
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
