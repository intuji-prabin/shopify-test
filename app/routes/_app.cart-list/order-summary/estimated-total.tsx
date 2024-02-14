import {orderCharges} from './order-summary';

export default function EstimatedTotal() {
  // estimated total calculation
  const totalAmount = orderCharges.reduce((accumulator, currentValue) => {
    return accumulator + parseFloat(currentValue.amount);
  }, 0);

  return (
    <div className="order flex gap-4 flex-col p-6 border-b border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capi">
        YOUR ORDER SUMMARY
      </h3>

      <ul className="py-4  border border-y-grey-50 border-x-0">
        {orderCharges.map((orders, index) => {
          return (
            <li className="flex justify-between" key={index}>
              <p className="capitalize"> {orders.title}</p>
              <span className="text-lg font-medium">
                {' '}
                ${parseFloat(orders.amount).toFixed(2)}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="flex justify-between [&>p]:font-medium [&>p]:text-2xl [&>p]:text-grey-900">
        <p>Estimated Total</p>
        <p className="total_amout">${totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
}
