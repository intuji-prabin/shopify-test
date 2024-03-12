import { Link } from '@remix-run/react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import Tick from '~/components/icons/tick';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Routes } from '~/lib/constants/routes.constent';

function concatDefaultAddress(address1: string, address2: string) {
  return address1.concat(' ', address2).trim();
}

export function ShippingLocation({ addressList, defaultAddress, defaultId }: any) {
  return (
    <div className="ship-location">
      <p className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-base font-normal text-grey-800 leading-[21px]">
        Change Shipping Location
      </p>
      <select
        name="addressId"
        className="w-full min-w-[92px] place-order h-full border-grey-100"
        defaultValue={defaultAddress}
      >
        <option value={defaultId}>
          {defaultAddress}
        </option>
        {addressList?.map((address: any, index: number) => {
          const concatAddressList = concatDefaultAddress(
            address.address1,
            address.address2,
          );
          return (
            <option value={address.id} key={index + 'address'}>
              {address.zip + ", " + concatAddressList + ", " + address.country}
            </option>
          )
        })}
      </select>
    </div>
  );
}

export function DateDelivery() {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  console.log("date", format(new Date(date), 'yyyy-MM-dd'));

  return (
    <div>
      <p className="text-base font-normal text-grey-800 leading-[21px]">
        Requested Delivery Date
      </p>
      <input type="hidden" name="requestedDeliveryDate" value={format(new Date(date), 'yyyy-MM-dd')} />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            className={`relative w-full bg-white text-grey-700 text-base border border-grey-100 justify-between text-left font-normal flex-row-reverse not-italic h-[37px] p-3 hover:bg-white ${!date && 'text-muted-foreground'
              }`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date ? format(date, 'yyyy-MM-dd') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            initialFocus={true}
            onDayClick={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function PurchaseOrder() {
  return (
    <div className="flex flex-col gap-1 ">
      <label
        htmlFor="orderNumber"
        className="text-base text-normal leading-[21px] text-grey-800"
      >
        Purchase Order Number Or Order Number
      </label>
      <input
        type="text"
        id="orderNumber"
        name="poNumber"
        placeholder="Order Number"
        className="active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focus:bg-white active:bg-white hover:bg-white !bg-white"
      />
    </div>
  );
}
export function TextArea() {
  return (
    <div>
      <p>Remarks</p>
      <textarea
        name="remarks"
        cols={30}
        rows={10}
        className="w-full h-full resize-none"
        value="I kindly request your assistance in ensuring that my order is dispatched and delivered as per the requested delivery date."
      />
    </div>
  );
}
export function PromoCode() {
  const [activatePromo, setActivatePromo] = useState(false);
  function handleActivatePromoCode() {
    setActivatePromo(!activatePromo);
  }
  return (
    <>
      <div className="flex flex-col gap-1">
        <p className="text-base text-normal leading-[21px] text-grey-800">
          Enter promo code here
        </p>
        <div className="flex flex-col w-full gap-2 sm:flex-row">
          <input
            type=" text"
            className={` ${activatePromo ? 'bg-semantic-success-100 border-none' : 'bg-white'
              } grow`}
            placeholder="Enter promo code here"
          />

          <Button
            variant="secondary"
            className="min-w-[99px]"
            onClick={handleActivatePromoCode}
          >
            {activatePromo ? 'Remove' : 'Apply'}
          </Button>
        </div>
        {activatePromo ? (
          <div className="flex">
            <Tick width="20px" height="20px" fillColor="#3BBA53" />

            <p className="text-semantic-success-500 font-normal leading-5 text-[14px] items-center">
              {' '}
              Promo code activated
            </p>
          </div>
        ) : undefined}
      </div>
    </>
  );
}
type ShippingAddressProps = {
  default_address: string;
  phone: string;
  postal_code: string;
};
export function ShippingAddress({
  default_address,
  phone,
  postal_code,
}: ShippingAddressProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <span className="p-1.5 bg-primary-200 text-sm font-medium leading-4 text-primary-500">
          Default Shipping Address
        </span>
      </div>
      <ul>
        <li className="flex flex-wrap gap-x-4 gap-y-2">
          <p className="text-lg font-medium w-[85px]">Phone</p>
          <p className="text-lg w-[calc(100%_-_101px)]">{phone}</p>
        </li>
        <li className="flex flex-wrap gap-x-4 gap-y-2">
          <p className="text-lg font-medium w-[85px]">Address</p>
          <p className="text-lg w-[calc(100%_-_101px)]">{default_address}</p>
        </li>
        <li className="flex flex-wrap gap-x-4 gap-y-2">
          <p className="text-lg font-medium w-[85px]">Postal Code</p>
          <p className="text-lg w-[calc(100%_-_101px)]">{postal_code}</p>
        </li>
      </ul>
    </div>
  );
}

export function ShoppingDetails({ shippingAddresses }: any) {
  const addressList = shippingAddresses.addresses;
  const defaultAddress = shippingAddresses.defaultAddress;

  const defaultAddress1 = defaultAddress.address1 ?? "";
  const defaultAddress2 = defaultAddress.address2 ?? "";

  const defaultAddresses = concatDefaultAddress(
    defaultAddress1,
    defaultAddress2,
  );
  return (
    <div className="flex flex-col gap-4 p-6 border-b order border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capitalize">
        Shipping Details
      </h3>
      {/* shipping detail form starts here */}
      <div className="flex flex-col gap-4">
        <ShippingLocation addressList={addressList} defaultAddress={defaultAddresses} defaultId={defaultAddress.id} />
        <DateDelivery />
        <PurchaseOrder />
        <TextArea />
      </div>
      {/* shipping location starts here */}
      <div className="flex flex-col gap-4">
        <PromoCode />
        <ShippingAddress
          default_address={defaultAddresses && defaultAddresses || '-'}
          phone={defaultAddress?.phone && defaultAddress?.phone || '-'}
          postal_code={defaultAddress?.zip && defaultAddress?.zip || '-'}
        />
      </div>
      {/* place order starts here */}
      {/* <Button className="p-0" variant="primary">
        <Link
          to={Routes.Order_SUCCESSFUL}
          className="flex items-center justify-center w-full text-lg font-bold min-h-14"
        >
          Place order
        </Link>
      </Button> */}
      <Button className="text-lg min-h-14" variant="primary" type="submit">
        Place order
      </Button>
      <p className="text-lg font-normal leading-[22px] text-grey-700">
        <span className="underline text-primary-500">
          Availability, shipping, tax & promotions
        </span>
        are not final until you complete your order.
      </p>
    </div>
  );
}
