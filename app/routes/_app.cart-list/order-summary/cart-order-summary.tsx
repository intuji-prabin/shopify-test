import EstimatedTotal from './estimated-total';
import {ShoppingDetails} from './order-shopping-details';

export default function OrderSummary() {
  return (
    <div className="bg-white max-w-[unset] w-full lg:max-w-[411px] ">
      <EstimatedTotal />
      <ShoppingDetails />
    </div>
  );
}
