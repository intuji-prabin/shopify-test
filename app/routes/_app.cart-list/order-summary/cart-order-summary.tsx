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
  placeOrder,
  promoCodeApplied,
  discountPrice,
  discountMessage,
  totalPriceWithDiscount,
  actionData,
  fetcher
}: any) {

  return (
    <div className="bg-white w-full xl:w-[411px]">
      <EstimatedTotal cartSubTotalPrice={cartSubTotalPrice}
        cartTotalPrice={cartTotalPrice}
        freight={freight}
        surcharges={surcharges}
        gst={gst}
        currency={currency}
        promoCodeApplied={promoCodeApplied}
        discountPrice={discountPrice}
        discountMessage={discountMessage}
        totalPriceWithDiscount={totalPriceWithDiscount}
        fetcher={fetcher}
      />
      {shippingAddresses ?
        <Form method="POST">
          <ShoppingDetails shippingAddresses={shippingAddresses} updateCart={updateCart} placeOrder={placeOrder} actionData={actionData} />
        </Form>
        : <p className='p-6 font-medium text-red-500'>You do not have any shipping address added. Please add one to place order.</p>}
    </div>
  );
}
