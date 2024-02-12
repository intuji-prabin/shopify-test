import {orderCharges} from './order-summary';

export default function EstimatedTotal() {
  return (
    <div className="order flex gap-4 flex-col p-6 border-b border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capi">
        YOUR ORDER SUMMARY
      </h3>

      <ul className="py-4  border border-y-grey-50 border-x-0">
        {orderCharges.map((orders) => {
          return (
            <li className="flex justify-between">
              <p> {orders.title}</p>
              <span className="text-lg font-medium"> {orders.amount}</span>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-between [&>p]: font-medium [&>p]:text-2xl [&>p]:text-grey-900">
        <p>Estimated Total</p>
        <p>$2097.66</p>
      </div>
    </div>
  );
}
