import { Form } from '@remix-run/react';
import EstimatedTotal from './estimated-total';
import { ShoppingDetails } from './order-shopping-details';

export default function OrderSummary({
  cartSubTotalPrice,
  cartTotalPrice,
  freight,
  surcharges,
  gst,
  shippingAddresses,
  currency,
  updateCart,
  placeOrder
}: any) {
  return (
    <div className="bg-white w-full xl:w-[411px]">
      <Form method="POST">
        <EstimatedTotal cartSubTotalPrice={cartSubTotalPrice}
          cartTotalPrice={cartTotalPrice}
          freight={freight}
          surcharges={surcharges}
          gst={gst} currency={currency} />
        {shippingAddresses ?
          <ShoppingDetails shippingAddresses={shippingAddresses} updateCart={updateCart} placeOrder={placeOrder} />
          : <p className='p-6 font-medium text-red-500'>You do not have any shipping address added. Please add one to place order.</p>}
      </Form>
    </div>
  );
}
