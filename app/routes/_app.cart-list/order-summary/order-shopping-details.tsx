import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {format, setDate} from 'date-fns';
import {Calendar as CalendarIcon, Route} from 'lucide-react';
import {Calendar} from '~/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';
import {Button} from '~/components/ui/button';
import {Link} from '@remix-run/react';
import {useState} from 'react';
import {Routes} from '~/lib/constants/routes.constent';

export function ShippingLocation() {
  return (
    <div className="ship-location">
      {' '}
      <p className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-base font-normal text-grey-800 leading-[21px]">
        Change Shipping Location
      </p>
      <Select>
        <SelectTrigger className="w-full h-[37px] rounded-none border border-grey-100">
          <SelectValue placeholder="99th Street, Wandiligong, NSW" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function DateDelivery() {
  const [date, setDate] = useState<Date>(new Date('11/28/2023'));

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  return (
    <div>
      <p className="text-base font-normal text-grey-800 leading-[21px]">
        Requested Delivery Date
      </p>{' '}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            className={`relative w-full bg-white text-grey-700 text-base border border-grey-100 justify-between text-left font-normal flex-row-reverse not-italic h-[37px] p-3 hover:bg-white ${
              !date && 'text-muted-foreground'
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
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
        name="orderNumber"
        placeholder="Order Number"
        className="active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focu:bg-white active:bg-white hover:bg-white !bg-white"
      />
    </div>
  );
}
export function TextArea() {
  return (
    <>
      <div>
        <p>Remarks</p>
        <textarea
          name=""
          id=""
          cols={30}
          rows={10}
          className="w-full resize-none h-full"
          defaultValue="I kindly request your assistance in ensuring that my order is dispatched and delivered as per the requested delivery date."
        />
      </div>
    </>
  );
}
export function PromoCode() {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base text-normal leading-[21px] text-grey-800">
        Enter promo code here
      </p>
      <div className="flex gap-2 flex-col sm:flex-row">
        <input
          type=" text"
          className="grow"
          placeholder="Enter promo code here"
        />
        <Button variant="secondary" className="min-w-[99px]">
          Apply
        </Button>
      </div>
    </div>
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
    <div>
      <div className="flex gap-4">
        <p className="font-bold italic leading-6 text-lg text-grey-700 capitalize">
          New South Wales
        </p>
        <span className="p-1.5 bg-primary-200 text-sm font-medium leading-4 text-primary-500">
          Default Shipping Address
        </span>
      </div>
      <ul>
        <li className="flex gap-x-4 flex-wrap gap-y-2">
          <p className="text-lg font-medium w-[85px]">Phone</p>
          <p className="text-lg w-[calc(100%_-_101px)]">+{phone}</p>
        </li>
        <li className="flex gap-x-4 flex-wrap gap-y-2">
          <p className="text-lg font-medium w-[85px]">Address</p>
          <p className="text-lg w-[calc(100%_-_101px)]">{default_address}</p>
        </li>
        <li className="flex gap-x-4 flex-wrap gap-y-2">
          <p className="text-lg font-medium w-[85px]">Postal Code</p>
          <p className="text-lg w-[calc(100%_-_101px)]">{postal_code}</p>
        </li>
      </ul>
    </div>
  );
}
export function ShoppingDetails() {
  return (
    <div className="order flex gap-4 flex-col p-6 border-b border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capitalize">
        Shipping Details
      </h3>
      {/* shipping detail form starts here */}
      <div className="flex flex-col gap-4">
        <ShippingLocation />
        <DateDelivery />
        <PurchaseOrder />
        <TextArea />
      </div>
      {/* shipping location starts here */}
      <div className="flex flex-col gap-4">
        <PromoCode />
        <ShippingAddress
          default_address={'99th Street, Wandiligong, NSW'}
          phone={'61 414 123 456'}
          postal_code={'2424'}
        />
      </div>
      {/* place order starts here */}
      <Button>
        <Link to={Routes.Order_SUCCESSFUL} className="w-full">
          Place order
        </Link>
      </Button>
      <p className="text-lg font-normal leading-[22px] text-grey-700">
        <span className="text-primary-500">
          Availability, shipping, tax & promotions
        </span>{' '}
        are not final until you complete your order.
      </p>
    </div>
  );
}
