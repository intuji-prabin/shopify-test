import { Customer } from "./shipping-address.server";

export default function ShippingAddressCards({ data }: { data: Customer | null }) {
  const defaultAddress2 = data?.defaultAddress?.address2 ? data?.defaultAddress?.address2 : "-";
  const defaultAddress = data?.defaultAddress?.address1 ? data?.defaultAddress?.address1 : defaultAddress2;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div className="p-6 bg-white">
        <ul className="space-y-3">
          <li>
            <span className="p-1.5 bg-primary-200 text-sm font-medium leading-4 text-primary-500">
              Default Shipping Address
            </span>
          </li>
          <li className="flex gap-x-4 flex-wrap gap-y-2">
            <p className="text-lg font-medium w-[85px]">Address</p>
            <p className="text-lg w-[calc(100%_-_101px)]">{defaultAddress}</p>
          </li>
          <li className="flex gap-x-4 flex-wrap gap-y-2">
            <p className="text-lg font-medium w-[85px]">Postal Code</p>
            <p className="text-lg w-[calc(100%_-_101px)]">{data?.defaultAddress?.zip ?? "-"}</p>
          </li>
          <li className="flex gap-x-4 flex-wrap gap-y-2">
            <p className="text-lg font-medium w-[85px]">Fax</p>
            <p className="text-lg w-[calc(100%_-_101px)]">{data?.defaultAddress?.firstName ?? "-"}</p>
          </li>
          <li className="flex gap-x-4 flex-wrap gap-y-2">
            <p className="text-lg font-medium w-[85px]">Phone</p>
            <p className="text-lg w-[calc(100%_-_101px)]">{data?.defaultAddress?.phone ?? "-"}</p>
          </li>
          <li className="flex gap-x-4 flex-wrap gap-y-2">
            <p className="text-lg font-medium w-[85px]">Country</p>
            <p className="text-lg w-[calc(100%_-_101px)]">{data?.defaultAddress?.country ?? "-"}</p>
          </li>
        </ul>
      </div>
      {data?.addresses.map((shippingCard: any, index: any) => (
        <div className="p-6 bg-white flex items-center" key={"address" + index}>
          <ul className="space-y-3" >
            <li className="flex gap-x-4 flex-wrap gap-y-2">
              <p className="text-lg font-medium w-[85px]">Address</p>
              <p className="text-lg w-[calc(100%_-_101px)]">{shippingCard?.address1 ? shippingCard?.address1 : shippingCard?.address2 ? shippingCard?.address2 : "-"}</p>
            </li>
            <li className="flex gap-x-4 flex-wrap gap-y-2">
              <p className="text-lg font-medium w-[85px]">Postal Code</p>
              <p className="text-lg w-[calc(100%_-_101px)]">{shippingCard?.zip ?? "-"}</p>
            </li>
            <li className="flex gap-x-4 flex-wrap gap-y-2">
              <p className="text-lg font-medium w-[85px]">Fax</p>
              <p className="text-lg w-[calc(100%_-_101px)]">{shippingCard?.firstName ?? "-"}</p>
            </li>
            <li className="flex gap-x-4 flex-wrap gap-y-2">
              <p className="text-lg font-medium w-[85px]">Phone</p>
              <p className="text-lg w-[calc(100%_-_101px)]">{shippingCard?.phone ?? "-"}</p>
            </li>
            <li className="flex gap-x-4 flex-wrap gap-y-2">
              <p className="text-lg font-medium w-[85px]">Country</p>
              <p className="text-lg w-[calc(100%_-_101px)]">{shippingCard?.country ?? "-"}</p>
            </li>
          </ul>
        </div>
      ))
      }
    </div >
  );
}
