export default function EstimatedTotal({ cartSubTotalPrice, cartTotalPrice, frieght, subcharges, gst }: any) {

  console.log({ cartSubTotalPrice, cartTotalPrice, frieght, subcharges, gst })

  return (
    <div className="flex flex-col gap-4 p-6 border-b order border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capi">
        YOUR ORDER SUMMARY
      </h3>
      <ul className="py-4 border border-y-grey-50 border-x-0">
        <li className="flex justify-between">
          <p className="capitalize">subtotal</p>
          <span className="text-lg font-medium">
            ${cartSubTotalPrice}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize">frieght</p>
          <span className="text-lg font-medium">
            ${frieght}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize">subcharges</p>
          <span className="text-lg font-medium">
            ${subcharges}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize">Total Excl. GST</p>
          <span className="text-lg font-medium">
            ${gst}
          </span>
        </li>
      </ul>
      <div className="flex justify-between [&>p]:font-medium [&>p]:text-2xl [&>p]:text-grey-900">
        <p>Estimated Total</p>
        <p className="total_amout">${cartTotalPrice}</p>
      </div>
    </div>
  );
}
