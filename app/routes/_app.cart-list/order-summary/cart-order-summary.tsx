import EstimatedTotal from './estimated-total';
import {ShoppingDetails} from './order-shopping-details';

export default function OrderSummary() {
  return (
    <div className="bg-white min-w-[411px] ">
      <EstimatedTotal />
      <ShoppingDetails />
    </div>
  );
}
