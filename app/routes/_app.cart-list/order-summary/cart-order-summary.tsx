import { Form } from '@remix-run/react';
import EstimatedTotal from './estimated-total';
import { ShoppingDetails } from './order-shopping-details';
import { useState } from 'react';

export default function OrderSummary({
  cartSubTotalPrice,
  cartTotalPrice,
  freight,
  surcharges,
  gst,
  shippingAddresses,
  currency,
  updateCart,
  placeOrder,
  data,
  promoCodeApplied,
  discountPrice,
  discountMessage,
  totalPriceWithDiscount,
}: any) {
  const [promoCode, setPromoCode] = useState(promoCodeApplied);
  return (
    <div className="bg-white w-full xl:w-[411px]">
      <EstimatedTotal cartSubTotalPrice={cartSubTotalPrice}
        cartTotalPrice={cartTotalPrice}
        freight={freight}
        surcharges={surcharges}
        gst={gst}
        currency={currency}
        data={data}
        setPromoCode={setPromoCode}
        promoCode={promoCode}
        promoCodeApplied={promoCodeApplied}
        discountPrice={discountPrice}
        discountMessage={discountMessage}
        totalPriceWithDiscount={totalPriceWithDiscount}
      />
      {shippingAddresses ?
        <Form method="POST">
          <ShoppingDetails shippingAddresses={shippingAddresses} updateCart={updateCart} placeOrder={placeOrder} />
        </Form>
        : <p className='p-6 font-medium text-red-500'>You do not have any shipping address added. Please add one to place order.</p>}
    </div>
  );
}
