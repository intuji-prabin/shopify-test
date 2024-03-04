import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';

export async function getProductDetails(customerId: string, handle: string) {
  try {
    const results: any = await fetch(
      `${ENDPOINT.PRODUCT.GET_PRODUCT}/${customerId}/${handle}`,
      // `https://processors-fatty-dvds-destroyed.trycloudflare.com/api/product/${customerId}/${handle}`,
      {
        method: 'GET',
      },
    );
    const response = await results.json();
    // if (!results.status) {
    //   throw new Response(results.message, {
    //     status: 404,
    //   });
    // }
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

export const addProductToCart = async ( cartInfo : any, accessTocken : string, context : any ) => {
    const { session, storefront } = context
    const sessionCartInfo = session.get( CART_SESSION_KEY )
    if( !sessionCartInfo ) {
      const cartSetInfo = await setNewCart( context, accessTocken, cartInfo )
      console.log("cart data in ", cartSetInfo)
      session.set( CART_SESSION_KEY, cartSetInfo )
      return cartSetInfo
    }

    if( sessionCartInfo?.[cartInfo?.productId] ) {
      const cartUpdateInfo = await updateAllReadyAddedCart( context, accessTocken, cartInfo,  sessionCartInfo )
      console.log("cart data ", cartUpdateInfo)
      session.set( CART_SESSION_KEY, cartUpdateInfo )
      return cartUpdateInfo
    }
    //  session.unset( CART_SESSION_KEY)
    console.log("sessionCartInfo ", sessionCartInfo)
    return true
}

const setNewCart = async ( context : any, accessTocken : string, cartInfo : any ) => {
    const { storefront } = context 
    const responses = await storefront.mutate(SET_NEW_CART, { variables : cartFormateVariable( cartInfo, accessTocken )})
    const formateResponse = cartResponseFormate( responses, accessTocken )
    console.log("radfs ", responses)
    console.log("radfs ", responses?.cartCreate?.userErrors[0])
    return formateResponse
}

const updateAllReadyAddedCart = async ( context : any, accessTocken : any, cartInfo : any,  sessionCartInfo : any ) => {
  const { storefront } = context
  const updateCartResponse = await storefront.mutate(UPDATE_OLD_CART, { variables : cartUpdateFormateVariable( sessionCartInfo, cartInfo )})
  if( !updateCartResponse ) {
    throw new Error("Cart not updated")
  }
  console.log("asdfdsf ", updateCartResponse?.cartLinesUpdate)
  if( updateCartResponse?.cartLinesUpdate?.userErrors.length > 0 ) {
      throw new Error( updateCartResponse?.cartLinesUpdate?.userErrors[0]?.message )
  }

  sessionCartInfo[cartInfo?.productId].quantity = cartInfo?.quantity
  sessionCartInfo[cartInfo?.productId].UOM = cartInfo?.selectUOM

  return sessionCartInfo
}

const cartResponseFormate = ( cartResponse : any, accessTocken : string ) => {
  if( !cartResponse ) {
    throw new Error("Cart not added")
  }
  const cartCreate = cartResponse?.cartCreate
  if( cartCreate?.userErrors.length > 0 ) {
    throw new Error( cartCreate?.userErrors[0]?.message )
  }
  const cart = cartCreate?.cart
  const buyerIdentity = cart?.buyerIdentity?.customer
  const lines = cart?.lines?.nodes
  const cartListed = {
    cartId : cart?.id,
    customerId : buyerIdentity?.id.replace("gid://shopify/Customer/", ""),
    accessTocken,
    lineItems : 0,
    
  } as any

  if( lines.length > 0 ) {
    lines.map(( items : any ) => {
      const merchandise = items?.merchandise
      const veriantId = merchandise?.id.replace("gid://shopify/ProductVariant/", "")
      const productId = merchandise?.product?.id.replace("gid://shopify/Product/", "")
      cartListed.lineItems = cartListed.lineItems + 1
      cartListed[productId] = {
        productId ,
        veriantId,
        lineId : items?.id,
        quantity : items?.quantity,
        UOM : items?.attributes.filter( ( att : any ) => att?.key == "selectedUOM")?.[0]?.value
      }

    })
  }

  return cartListed
}

const cartFormateVariable = ( cartInfo : any, accessTocken : string ) => {
  const variantId = `gid://shopify/ProductVariant/${cartInfo?.productVeriantId}`
  return {
      input: {
        buyerIdentity  : {
          customerAccessToken  :   accessTocken 
      },
        lines  : [
        {
            attributes   : [
              {
                    key     :   "selectedUOM",
                    value   :   cartInfo?.selectUOM  
              }
          ],
            merchandiseId : variantId,
            quantity      : parseInt(cartInfo?.quantity)
        }
      ]
    }
  }
  
}

const cartUpdateFormateVariable = ( sessionCartInfo : any, cartInfo : any ) => {
  const setCartData = sessionCartInfo?.[cartInfo?.productId]
  console.log("setCartData ", setCartData , setCartData?.lineId)
  return {
     cartId :  sessionCartInfo?.cartId,
     lines : [
      {
        id  :  setCartData?.lineId,
        quantity : parseInt( cartInfo?.quantity ),
        merchandiseId : `gid://shopify/ProductVariant/${cartInfo?.productVeriantId}`,
        attributes   : [
          {
                key     :   "selectedUOM",
                value   :   cartInfo?.selectUOM  
          }
        ]
      }
    ]
  }
}

const SET_NEW_CART = `mutation cartCreate( $input : CartInput) {
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
}` as const

const UPDATE_OLD_CART = `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first : 240 ) {
          nodes {
              id
              quantity
          }
      }
  }
    userErrors {
      field
      message
    }
  }
}` as const

