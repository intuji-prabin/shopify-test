import { CONSTANT } from "~/lib/constants/product.session";
import { ADD_ITEMS_IN_CART } from "../_app.product_.$productSlug/product.server";
import { CART_SESSION_KEY } from "~/lib/constants/cartInfo.constant";

export const addedBulkCart = async ( cartInfo : any, context : any, accessTocken : any ) => {
    const {storefront, session} = context;
    const sessionCartInfo = session.get(CART_SESSION_KEY)
    // if()
    const keyList = Object.keys(cartInfo);
    const productData = [] as any;
    const formateData = keyList.map((key: any) => {
        const keySplit = key.split('_');
        if ( key != 'bulkCart' ) {
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

    const addItemInCartresponses = await storefront.mutate(ADD_ITEMS_IN_CART, {
        variables: cartAddLineFormateVariable(cartInfo, sessionCartInfo),
    });
}

const cartAddLineFormateVariable = (cartItemList: any, sessionCartInfo: any) => {
    // const variantId = `${CONSTANT?.variantId}${cartItemList?.productVariantId}`;
    return {
      cartId: sessionCartInfo?.cartId,
      lines: cartItemList,
    };
  };