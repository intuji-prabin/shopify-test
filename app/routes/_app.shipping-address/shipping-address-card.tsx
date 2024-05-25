import {
  Address,
  ShippingAddress,
} from '~/routes/_app.shipping-address/shipping-address.server';

function concatDefaultAddress(address1: string, address2: string) {
  return address1.concat(' ', address2).trim();
}

export default function ShippingAddressCards({
  shippingAddresses,
}: {
  shippingAddresses: ShippingAddress;
}) {
  const addressList = shippingAddresses.addresses;
  const defaultAddress = shippingAddresses.defaultAddress;

  const defaultAddress1 = defaultAddress.address1 ?? '';
  const defaultAddress2 = defaultAddress.address2 ?? '';

  const defaultAddresses = concatDefaultAddress(
    defaultAddress1,
    defaultAddress2,
  );

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      shippingaddresses-cy="contact-cards"
    >
      <div className="p-6 bg-white">
        <ul className="space-y-3">
          <li>
            <span className="p-1.5 bg-primary-200 text-sm font-medium leading-4 text-primary-500">
              Default Shipping Address
            </span>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Address</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddresses || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Postal Code</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.zip || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Fax</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.fax || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Suburb</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.suburb || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">House Number</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.houseNumber || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Phone</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.phone || '-'}
            </p>
          </li>
          <li className="flex flex-wrap gap-x-4 gap-y-2">
            <p className="text-lg font-medium w-[95px]">Country</p>
            <p className="text-lg w-[calc(100%_-_111px)]">
              {defaultAddress.country || '-'}
            </p>
          </li>
        </ul>
      </div>
      {addressList.map((shippingCard: Address, index: number) => {
        const concatAddresses = concatDefaultAddress(
          shippingCard.address1,
          shippingCard.address2,
        );
        return (
          <div
            className="flex items-center p-6 bg-white"
            key={'address' + index}
          >
            <ul className="space-y-3">
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Address</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {concatAddresses || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Postal Code</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.zip || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Fax</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.fax || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Suburb</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.suburb || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">House Number</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.houseNumber || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Phone</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.phone || '-'}
                </p>
              </li>
              <li className="flex flex-wrap gap-x-4 gap-y-2">
                <p className="text-lg font-medium w-[95px]">Country</p>
                <p className="text-lg w-[calc(100%_-_111px)]">
                  {shippingCard.country || '-'}
                </p>
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}
