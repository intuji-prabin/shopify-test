import { Form } from '@remix-run/react';
import EstimatedTotal from './estimated-total';
import { ShoppingDetails } from './order-shopping-details';

export default function OrderSummary({
  cartSubTotalPrice,
  cartTotalPrice,
  frieght,
  subcharges,
  gst,
  shippingAddresses
}: any) {
  return (
    <div className="bg-white max-w-[unset] w-full lg:max-w-[411px] ">
      <EstimatedTotal cartSubTotalPrice={cartSubTotalPrice}
        cartTotalPrice={cartTotalPrice}
        frieght={frieght}
        subcharges={subcharges}
        gst={gst} />
      <Form method="POST">
        <ShoppingDetails shippingAddresses={shippingAddresses} />
      </Form>
    </div>
  );
}
