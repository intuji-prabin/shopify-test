import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import MyProducts from './order-my-products/cart-myproduct';
import OrderSummary from './order-summary/cart-order-summary';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { getCartList } from './cart.server';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ( { context, request } : LoaderFunctionArgs) => {
    await isAuthenticate(context);
    try {
      let sessionCartInfo     = await context.session.get( CART_SESSION_KEY )
      
      if( ! sessionCartInfo ) {
        throw new Error("Cart not found")
      }

      const cartList = await getCartList( context, request, sessionCartInfo )
      // console.log(cartList)
      return json({cartList})
    } catch( error ) {
      if( error instanceof Error ) {
        console.log("error ", error?.message)
        return json({})
      }
      console.log("error generates ")
      return json({})

    }
}

export default function CartList() {
  const { cartList } : any = useLoaderData<typeof loader>();
  console.log(".  cartList ", cartList)
  return (
    <>
      <HeroBanner
        image_url={'/place-order.png'}
        section_name={'SHOPPING CART'}
      />
      <UploadSearchbar />
      <div className="flex justify-between container my-6 gap-6 items-start flex-col lg:flex-row">
        <MyProducts products={cartList?.productList} />
        <OrderSummary 
          cartSubTotalPrice={ cartList?.cartSubTotalPrice} 
          cartTotalPrice={ cartList?.cartTotalPrice} 
          frieght={ cartList?.frieght } 
          subcharges={ cartList?.subcharges } 
          gst={ cartList?.gst } 
        />
      </div>
    </>
  );
}
