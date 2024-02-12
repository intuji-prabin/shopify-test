import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import * as React from 'react';
import {format, setDate} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';

import {Button} from '~/components/ui/button';
import {Calendar} from '~/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';
import {cn} from '~/lib/utils/utils';

export function ShippingLocation() {
  return (
    <div>
      {' '}
      <p className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-base font-normal text-grey-800 leading-[21px]">
        Change Shipping Location
      </p>
      <Select>
        <SelectTrigger className="w-full h-[37px] rounded-none border border-grey-100">
          <SelectValue
            placeholder="99th Street, Wandiligong, NSW"
            className="placeholder:text-grey-400 leading-[21px] font-normal text-base placeholder:not-italic"
          />
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
  const [date, setDate] = React.useState<Date>(new Date('11/28/2023'));

  return (
    <div>
      <p className="text-base font-normal text-grey-800 leading-[21px]">
        Requested Delivery Date
      </p>{' '}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            className={cn(
              'w-full bg-white text-grey-700 text-base border border-grey-100 justify-between text-left font-normal flex-row-reverse not-italic h-[37px] p-3 hover:bg-white ',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={date} initialFocus />
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
        <textarea name="" id="" cols={30} rows={10} className="w-full">
          I kindly request your assistance in ensuring that my order is
          dispatched and delivered as per the requested delivery date.
        </textarea>
      </div>
    </>
  );
}
export function ShoppingDetails() {
  return (
    <div className="order flex gap-4 flex-col p-6 border-b border-grey-50">
      <h3 className="font-bold leading-[29px] text-2xl capitalize">
        Shipping Details
      </h3>

      {/* shipping detail form starts here */}
      <ShippingLocation />
      <DateDelivery />
      <PurchaseOrder />
      <TextArea />
      {/* shipping detail form ends here */}
    </div>
  );
}
