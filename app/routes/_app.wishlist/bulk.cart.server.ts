import {CONSTANT} from '~/lib/constants/product.session';
import {
  ADD_ITEMS_IN_CART,
  addProductToCart,
} from '../_app.product_.$productSlug/product.server';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {getAccessToken} from '~/lib/utils/auth-session.server';

export const addedBulkCart = async (
  cartInfo: any,
  context: any,
  accessTocken: any,
  request: Request,
) => {
  const {storefront, session} = context;
  const sessionCartInfo = session.get(CART_SESSION_KEY);
  console.log('cartInfo', cartInfo);
  const keyList = Object.keys(cartInfo);
  const productData = [] as any;
  const formateData = keyList.map((key: any) => {
    const keySplit = key.split('_');
    if (key != 'bulkCart' && key != '_action') {
      if (!productData.some((item: any) => item == keySplit[0])) {
        productData.push(keySplit[0]);
      }
    }
    return true;
  });
  const itemData = productData.map((id: any) => {
    return {
      attributes: [
        {
          key: 'selectedUOM',
          value: cartInfo[`${id}_uom`],
        },
      ],
      merchandiseId: `${CONSTANT?.variantId}${cartInfo[`${id}_variantId`]}`,
      quantity: parseInt(cartInfo[`${id}_quantity`]),
    };
  });
  console.log('first', itemData);
  const data = await addProductToCart(
    {},
    accessTocken,
    context,
    request,
    itemData,
  );
  if (!data) {
    throw new Error('Cart not added');
  }
  return true;
};
