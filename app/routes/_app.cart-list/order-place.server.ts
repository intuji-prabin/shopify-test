import { CART_SESSION_KEY } from "~/lib/constants/cartInfo.constant";
import { getUserDetails } from "~/lib/utils/user-session.server";
import { getCartList } from "./cart.server";
import { useFetch } from "~/hooks/useFetch";
import { AllowedHTTPMethods } from "~/lib/enums/api.enum";
import { ENDPOINT } from "~/lib/constants/endpoint.constant";

export const placeOrder = async (request: Request, context : any) => {
    const { userDetails } = await getUserDetails(request);

    try {
        
        let sessionCartInfo = await context.session.get(CART_SESSION_KEY)

    if (!sessionCartInfo) {
      throw new Error("Cart not found")
    }
      const formData = await request.formData();
      const allData = Object.fromEntries(formData)

      const cartList = await getCartList( context,  request, sessionCartInfo, true)

      const orderPlaceResponse = await orderCreate( cartList, userDetails?.id, allData )
      const cartRemoveResponse = await removeCart( cartList, context, sessionCartInfo )
      const cartSession = {...sessionCartInfo, cartItems : [], lineItems : 0}
      context.session.set(CART_SESSION_KEY, cartSession)
      return { cartSession }
    } catch (error) {
      if (error instanceof Error) {
        console.log('err', error?.message);
        return {};
      }
      return {};
    }
}

const orderCreate = async ( cartList : any, customerId : string, data : any ) => {
    const orderPlaceResponse = await useFetch<any>({
        method: AllowedHTTPMethods.POST,
        url: `${ENDPOINT.PRODUCT.ORDER}/${customerId}`,
        body: JSON.stringify({productList : cartList, extraData : data}),
    });

    if( ! orderPlaceResponse?.status ) {
        throw new Error(orderPlaceResponse?.message)
    }

    return orderPlaceResponse?.payload
}

const removeCart = async ( cartList : any, context : any, sessionCartInfo : any ) => {
    const lineItems = [] as any
    cartList.map( ( items : any ) => {
        lineItems.push(items?.id)
    } )
    const lineItemRemoveResponse = await context.storefront.mutate( REMOVE_CART, { variables : {
        cartId : sessionCartInfo?.cartId,
        lineIds : lineItems
    } })
      
    if( lineItemRemoveResponse?.errors ) {
        throw new Error("Cart not remove but order is placed")
    }

    if( lineItemRemoveResponse?.cartLinesRemove?.userErrors.length > 0 ) {
        throw new Error( lineItemRemoveResponse?.cartLinesRemove?.userErrors[0]?.message )
    }

    if( lineItemRemoveResponse?.cartLinesRemove?.cart?.lines?.nodes.length > 0 ) {
        throw new Error("Some cart not remove due to server error")
    }
    return true
}

const REMOVE_CART = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        lines( first : 10 ) {
          nodes {
              id
          }
        }
      }
      userErrors {
        field
        message
      }
    }
}` as const