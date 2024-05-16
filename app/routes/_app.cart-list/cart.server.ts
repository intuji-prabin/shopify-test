import {useFetch} from '~/hooks/useFetch';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/user-session.server';

export const getCartList = async (
  context: any,
  request: Request,
  sessionCartInfo: any,
  fronOrder = false,
) => {
  const {userDetails} = await getUserDetails(request);

  const cartLists = await context.storefront.query(GET_CART_LIST, {
    variables: {cartId: sessionCartInfo?.cartId},
  });
  if (!cartLists) {
    throw new Error('Cart List not found');
  }
  return await formateCartList(
    cartLists,
    userDetails?.id,
    fronOrder,
    // sessionCartInfo,
    // context,
  );
};

const formateCartList = async (
  cartResponse: any,
  customerId: string,
  fronOrder: boolean,
  // sessionCartInfo: any,
  // context: any,
) => {
  const cartLine = cartResponse?.cart?.lines?.nodes;
  let productList = [] as any;
  if (cartLine.length < 1) {
    return {productList: []};
  }
  // sessionCartInfo.lineItems = cartLine.length;
  // await context.session.set(CART_SESSION_KEY, sessionCartInfo);
  cartLine.map((items: any) => {
    const merchandise = items?.merchandise;
    const variantId = merchandise?.id.replace(
      'gid://shopify/ProductVariant/',
      '',
    );
    const productId = merchandise?.product?.id.replace(
      'gid://shopify/Product/',
      '',
    );
    productList.push({
      id: items?.id,
      productId,
      variantId,
      quantity: items?.quantity,
      title: merchandise?.product?.title,
      sku: merchandise?.sku,
      featuredImage: merchandise?.product?.featuredImage?.url,
      uom: items?.attributes.filter(
        (att: any) => att?.key == 'selectedUOM',
      )?.[0]?.value,
      handle: merchandise?.product?.handle,
    });
  });

  if (fronOrder) {
    return productList;
  }
  const productWithPrice = await getPrice(customerId, productList);
  console.log('werwerwed ', productWithPrice);
  return productWithPrice;
};

const getPrice = async (customerId: string, productList: any) => {
  const priceResponse = await useFetch<any>({
    method: AllowedHTTPMethods.POST,
    url: `${ENDPOINT.PRODUCT.CART_DETAIL}/${customerId}`,
    body: JSON.stringify({productList}),
  });

  if (!priceResponse?.status) {
    throw new Error(priceResponse?.message);
  }
  return priceResponse?.payload;
};

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
                            featuredImage {
                                url
                            }
                        }
                    }
                }  
                
            }
        }
    }
}` as const;
