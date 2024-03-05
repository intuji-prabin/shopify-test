import { useFetch } from "~/hooks/useFetch";
import { ENDPOINT } from "~/lib/constants/endpoint.constant";
import { AllowedHTTPMethods } from "~/lib/enums/api.enum";
import { getUserDetails } from "~/lib/utils/user-session.server";

export const getCartList = async ( context : any, request : Request, sessionCartInfo : any ) => {
    const { userDetails } = await getUserDetails(request);
    const cartLists =  await context.storefront.query(GET_CART_LIST, { variables : { cartId : sessionCartInfo?.cartId }} )
    console.log("afsfds cartLists ", cartLists)
    if( ! cartLists ) {
        throw new Error("Cart List not found")
    }
    return await formateCartList( cartLists, userDetails?.id )
}

const formateCartList = async ( cartResponse : any, customerId : string) => {
    const cartLine = cartResponse?.cart?.lines?.nodes
    if( cartLine.length < 1 ) {
        throw new Error("Cart List is empty")
    }
    let productList = [] as any
    cartLine.map(( items : any) => {
        const merchandise = items?.merchandise
        console.log(" sdfsdf merchandise ", merchandise)
        const veriantId = merchandise?.id.replace("gid://shopify/ProductVariant/", "")
        const productId = merchandise?.product?.id.replace("gid://shopify/Product/", "")
        productList.push({
          productId ,
          veriantId,
          quantity : items?.quantity,
          UOM : items?.attributes.filter( ( att : any ) => att?.key == "selectedUOM")?.[0]?.value 
        })
    })

    const priceLIst = await getPrice( customerId, productList )
    console.log("datassdfsds ", productList)

}

const getPrice = async ( customerId: string, productList : any ) => {
    // const customerId = userDetails?.id
    const results = await useFetch<any>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.PRODUCT.CART_DETAIL}/${customerId}`,
      body : JSON.stringify({ productList }),
    });

    console.log("resultssss ", results)
}


export const GET_CART_LIST = `query getCart( $cartId : ID!) {
    cart( id : $cartId ) {
        buyerIdentity {
            customer {
                id
                email
                firstName
            }
        }
        lines( first : 250 ) {
            nodes {
                id
                quantity
                attributes {
                    key
                    value
                }
                merchandise {
                    __typename
                    ...on ProductVariant {
                        id
                        sku
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
}` as const