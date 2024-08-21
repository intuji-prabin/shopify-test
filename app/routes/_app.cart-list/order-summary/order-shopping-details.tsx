import {format} from 'date-fns';
import {Calendar as CalendarIcon} from 'lucide-react';
import {useEffect, useState} from 'react';
import {DangerAlert} from '~/components/icons/alert';
import {Button} from '~/components/ui/button';
import {Calendar} from '~/components/ui/calendar';
import Loader from '~/components/ui/loader';
import {Popover, PopoverContent, PopoverTrigger} from '~/components/ui/popover';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {Can} from '~/lib/helpers/Can';

function concatDefaultAddress(address1: string, address2: string) {
  return address1.concat(' ', address2).trim();
}

export function ShippingLocation({
  addressList,
  mergedAddressList,
  defaultAddress1,
  defaultAddress2,
  defaultId,
  defaultCountry,
  defaultFax,
  defaultPhone,
  defaultZip,
  defaultCountryCodeV2,
}: any) {
  const [country, setCountry] = useState(defaultCountry);
  const [address1, setAddress1] = useState(defaultAddress1);
  const [address2, setAddress2] = useState(defaultAddress2);
  const [zip, setZip] = useState(defaultZip);
  const [phone, setPhone] = useState(defaultPhone);
  const [fax, setFax] = useState(defaultFax);
  const [countryCodeV2, setCountryCodeV2] = useState(defaultCountryCodeV2);

  const getAddressDetail = (e: any) => {
    const selectedAddressId = e.target.value;
    const selectedAddress = mergedAddressList.find(
      (address: any) => address.id === selectedAddressId,
    );
    setCountry(selectedAddress?.country ? selectedAddress?.country : '');
    setAddress1(selectedAddress?.address1 ? selectedAddress?.address1 : '');
    setAddress2(selectedAddress?.address2 ? selectedAddress?.address2 : '');
    setZip(selectedAddress?.zip ? selectedAddress?.zip : '');
    setPhone(selectedAddress?.phone ? selectedAddress?.phone : '');
    setFax(selectedAddress?.fax ? selectedAddress?.fax : '');
    setCountryCodeV2(
      selectedAddress?.countryCodeV2 ? selectedAddress?.countryCodeV2 : '',
    );
  };

  const defaultAddress = concatDefaultAddress(defaultAddress1, defaultAddress2);

  return (
    <div className="ship-location">
      <p className="after:content-['*'] after:ml-0.5 after:text-red-500 block text-base font-normal text-grey-800 leading-[21px]">
        Change Shipping Location
      </p>
      <input type="text" name="country" value={country} className="hidden" />
      <input type="text" name="address1" value={address1} className="hidden" />
      <input type="text" name="address2" value={address2} className="hidden" />
      <input type="text" name="zip" value={zip} className="hidden" />
      <input type="text" name="phone" value={phone} className="hidden" />
      <input type="text" name="fax" value={fax} className="hidden" />
      <input
        type="text"
        name="countryCodeV2"
        value={countryCodeV2}
        className="hidden"
      />
      <select
        name="addressId"
        className="w-full min-w-[92px] place-order h-full border-grey-100"
        defaultValue={defaultAddress}
        onChange={getAddressDetail}
      >
        <option value={defaultId}>{defaultAddress}</option>
        {addressList?.map((address: any, index: number) => {
          const concatAddressList = `${address.address1}${
            address.address2 ? ', ' + address.address2 : ''
          }`;
          const addressDetails = [
            address.zip,
            concatAddressList,
            address.country,
          ]
            .filter(Boolean)
            .join(', ');
          return (
            <option value={address.id} key={`${index}address`}>
              {addressDetails}
            </option>
          );
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

  // console.log("date", format(new Date(date), 'yyyy-MM-dd'));

  return (
    <div>
      <p className="text-base font-normal text-grey-800 leading-[21px]">
        Requested Delivery Date
      </p>
      <input
        type="hidden"
        name="requestedDeliveryDate"
        value={format(new Date(date), 'yyyy-MM-dd')}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="primary"
            className={`relative w-full bg-white text-grey-700 text-base border border-grey-100 justify-between text-left font-normal flex-row-reverse not-italic h-[37px] p-3 hover:bg-white ${
              !date && 'text-muted-foreground'
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
            fromDate={new Date()}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function PurchaseOrder({
  actionData,
}: {
  actionData: {status: boolean; type: string; message: string};
}) {
  const [actionDataState, setActionDataState] = useState(actionData?.message);
  useEffect(() => {
    setActionDataState(actionData?.message);
  }, [actionData]);

  return (
    <div className="flex flex-col gap-1 ">
      <label
        htmlFor="orderNumber"
        className="text-base text-normal leading-[21px] text-grey-800 after:content-['*'] after:ml-0.5 after:text-red-500"
      >
        Purchase Order Number Or Order Number
      </label>
      <input
        type="text"
        id="orderNumber"
        name="poNumber"
        placeholder="Order Number"
        className="active:!border-grey-100 focus:!border-grey-100 hover:!border-grey-100 focus:bg-white active:bg-white hover:bg-white !bg-white"
        required
        pattern="[^' ']+"
        title="Purchase Order Number Or Order Number cannot have space."
        maxLength={20}
        onChange={() => actionData?.message && setActionDataState('')}
      />
      {actionData && actionDataState && actionData?.type === 'PONO' && (
        <p className={`pt-1 error-msg ${actionDataState ? 'block' : 'hidden'}`}>
          <DangerAlert />
          <span className="pl-1">{actionDataState}</span>
        </p>
      )}
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
        placeholder="I kindly request your assistance in ensuring that my order is dispatched and delivered as per the requested delivery date."
      />
    </div>
  );
}

export function PromoCode({
  promoCodeApplied,
  discountMessage,
  fetcher,
  setUpdateCart,
}: {
  promoCodeApplied: string;
  discountMessage: string;
  fetcher: any;
  setUpdateCart: any;
}) {
  const [promoCode, setPromoCode] = useState(promoCodeApplied);
  useEffect(() => {
    setPromoCode(promoCodeApplied);
  }, [promoCodeApplied]);
  const [promoError, setPromoError] = useState('');
  useEffect(() => {
    if (fetcher?.data?.message) {
      setPromoError(fetcher?.data?.message);
    }
  }, [fetcher?.data]);

  useEffect(() => {
    if (discountMessage != 'Discount has been Applied') {
      setPromoError(discountMessage);
    } else {
      setPromoError('');
    }
  }, [discountMessage]);
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base text-normal leading-[21px] text-grey-800 mb-1.5 sm:mb-0">
        Do you have any promocode?
      </p>
      <fetcher.Form
        method={promoCodeApplied ? 'DELETE' : 'POST'}
        onSubmit={(event: any) => {
          setUpdateCart(true);
          fetcher.submit(event.currentTarget);
        }}
      >
        <div className="flex flex-col items-center w-full gap-2 sm:flex-row">
          <input
            type="text"
            className={`w-full sm:grow ${
              promoCodeApplied &&
              'bg-semantic-success-100 pointer-events-none !border-semantic-success-100'
            }`}
            placeholder="Enter promo code here"
            name="promoCode"
            value={promoCode ? promoCode : ''}
            pattern=".*\S+.*"
            title="Promo code cannot have only spaces."
            disabled={
              fetcher.state === 'submitting' || fetcher.state === 'loading'
            }
            onChange={(e) => {
              setPromoCode(e?.target?.value);
              setPromoError('');
            }}
          />
          <div
            className={`
              ${
                fetcher.state === 'submitting' || fetcher.state === 'loading'
                  ? 'flex items-center gap-1'
                  : ''
              }
             w-full sm:w-[unset]`}
          >
            <Button
              variant="secondary"
              className={`${
                fetcher.state === 'submitting' || fetcher.state === 'loading'
                  ? 'w-[calc(100%_-_28px)]'
                  : 'w-full'
              } sm:min-w-[99px] sm:w-auto`}
              type="submit"
              value={promoCodeApplied ? 'promo_code_delete' : 'promo_code'}
              name="action"
              disabled={
                fetcher.state === 'submitting' || fetcher.state === 'loading'
              }
            >
              {fetcher.state === 'submitting' || fetcher.state === 'loading' ? (
                <div className="flex items-center justify-center h-full gap-2">
                  <span>{promoCodeApplied ? 'Removing' : 'Applying'}</span>
                </div>
              ) : (
                <>{promoCodeApplied ? 'Remove' : 'Apply'}</>
              )}
            </Button>
            {fetcher.state === 'submitting' || fetcher.state === 'loading' ? (
              <Loader />
            ) : null}
          </div>
        </div>
      </fetcher.Form>
      {(fetcher.state === 'idle' && promoError) ||
      (promoCodeApplied && promoError !== '') ? (
        <p className={`pt-1 error-msg`}>
          <DangerAlert />
          <span className="pl-1">{promoError}</span>
        </p>
      ) : null}
      {promoCodeApplied && discountMessage === 'Discount has been Applied' && (
        <p className="bg-semantic-success-100 uppercase text-xs py-1 px-2.5 font-semibold w-max">
          {discountMessage}
        </p>
      )}
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

export function ShoppingDetails({
  shippingAddresses,
  updateCart,
  orderPlaceStatus,
  actionData,
}: any) {
  const addressList = shippingAddresses.addresses;
  const defaultAddress = shippingAddresses.defaultAddress;
  const mergedAddressList = [
    shippingAddresses.defaultAddress,
    ...shippingAddresses.addresses,
  ];
  // console.log("defaultAddress", defaultAddress)

  const defaultAddress1 = defaultAddress.address1 ?? '';
  const defaultAddress2 = defaultAddress.address2 ?? '';

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
        <ShippingLocation
          addressList={addressList}
          mergedAddressList={mergedAddressList}
          defaultAddress1={defaultAddress1}
          defaultAddress2={defaultAddress2}
          defaultId={defaultAddress.id}
          defaultCountry={defaultAddress.country}
          defaultFax={defaultAddress.fax}
          defaultPhone={defaultAddress.phone}
          defaultZip={defaultAddress.zip}
          defaultCountryCodeV2={defaultAddress.countryCodeV2}
        />
        <DateDelivery />
        <PurchaseOrder actionData={actionData} />
        <TextArea />
      </div>
      {/* shipping location starts here */}
      <div className="flex flex-col gap-4">
        <ShippingAddress
          default_address={(defaultAddresses && defaultAddresses) || '-'}
          phone={(defaultAddress?.phone && defaultAddress?.phone) || '-'}
          postal_code={(defaultAddress?.zip && defaultAddress?.zip) || '-'}
        />
      </div>
      {/* place order starts here */}
      <Can I="view" a="place_order">
        {!updateCart && orderPlaceStatus ? (
          <Button
            className="text-lg min-h-14"
            variant="primary"
            type="submit"
            value="place_order"
            name="action"
          >
            Place order
          </Button>
        ) : (
          <div>
            <button
              className="flex items-center justify-center w-full gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-not-allowed text-grey-400 bg-grey-200 min-h-14"
              disabled
            >
              Place order
            </button>
            <p className="pt-1 text-lg italic text-red-500">
              TO "PLACE ORDER":
            </p>
            <ul className="pl-5 list-disc">
              <li>Press UPDATE CART button.</li>
              <li>Update quantity to be greater than zero.</li>
              <li>Update quantity to be less than {CART_QUANTITY_MAX}.</li>
            </ul>
          </div>
        )}
      </Can>
      <p className="text-lg font-normal leading-[22px] text-grey-700">
        <span className="underline text-primary-500">
          Availability, shipping, tax & promotions
        </span>
        &nbsp;are not final until you complete your order.
      </p>
    </div>
  );
}
