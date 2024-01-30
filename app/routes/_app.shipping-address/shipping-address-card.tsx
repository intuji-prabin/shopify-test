import { Customer } from "./shipping-address.server";

export default function ShippingAddressCards({ data }: { data: Customer }) {
  const defaultAddress = (data?.defaultAddress.address1 ?? "") + " " + (data?.defaultAddress.address2 ?? "");
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="p-6 bg-white min-w-[unset] 2xl:min-w-[628px] flex gap-[35px] flex-col">
        <div className="flex flex-col gap-[35px]">
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between">
              <h5>{defaultAddress}</h5>
              <div className="p-1.5 bg-primary-200 text-[14px] font-medium leading-4 text-primary-500">
                Default Shipping Address
              </div>
            </div>
            <ul className="flex flex-col gap-2">
              <li className="flex justify-start gap-[17px] text-grey-900">
                <p className="text-lg font-bold leading-[22px]">
                  Phone
                </p>
                <p className="font-normal">{data?.defaultAddress.phone}</p>
              </li>
              <li className="flex justify-start gap-[17px] text-grey-900">
                <p className="text-lg font-bold leading-[22px]">
                  Fax
                </p>
                <p className="font-normal">{data?.defaultAddress.firstName}</p>
              </li>
              <li className="flex justify-start gap-[17px] text-grey-900">
                <p className="text-lg font-bold leading-[22px]">
                  Postal Code
                </p>
                <p className="font-normal">{data?.defaultAddress.zip}</p>
              </li>
              <li className="flex justify-start gap-[17px] text-grey-900">
                <p className="text-lg font-bold leading-[22px]">
                  Country
                </p>
                <p className="font-normal">{data?.defaultAddress.country}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {data?.addresses.map((shippingCard: any, index: any) => (
        <div key={"address" + index} className="p-6 bg-white min-w-[unset] 2xl:min-w-[628px] flex gap-[35px] flex-col">
          <div className="flex flex-col gap-[35px]" key={shippingCard.id}>
            <div className="flex flex-col gap-2 ">
              <div className="flex justify-between">
                <h5>{shippingCard?.address1} {shippingCard?.address2}</h5>
              </div>
              <ul className="flex flex-col gap-2">
                <li className="flex justify-start gap-[17px] text-grey-900">
                  <p className="text-lg font-bold leading-[22px]">
                    Phone
                  </p>
                  <p className="font-normal">{shippingCard.phone}</p>
                </li>
                <li className="flex justify-start gap-[17px] text-grey-900">
                  <p className="text-lg font-bold leading-[22px]">
                    Fax
                  </p>
                  <p className="font-normal">{shippingCard.firstName}</p>
                </li>
                <li className="flex justify-start gap-[17px] text-grey-900">
                  <p className="text-lg font-bold leading-[22px]">
                    Postal Code
                  </p>
                  <p className="font-normal">{shippingCard.zip}</p>
                </li>
                <li className="flex justify-start gap-[17px] text-grey-900">
                  <p className="text-lg font-bold leading-[22px]">
                    Country
                  </p>
                  <p className="font-normal">{shippingCard.country}</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
