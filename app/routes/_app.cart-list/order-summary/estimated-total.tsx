import { PromoCode } from "./order-shopping-details";

export default function EstimatedTotal({ cartSubTotalPrice, cartTotalPrice, freight, surcharges, gst, currency, promoCodeApplied, discountPrice, discountMessage, totalPriceWithDiscount, fetcher, frieghtCharge, isLoading, currencySymbol }: any) {

  return (
    <div className="flex flex-col gap-4 p-6 border-b order border-grey-50">
      <PromoCode promoCodeApplied={promoCodeApplied} discountMessage={discountMessage} fetcher={fetcher} />
      <h3 className="font-bold leading-[29px] text-2xl">
        YOUR ORDER SUMMARY
      </h3>
      <ul className="py-4 border border-y-grey-50 border-x-0" data-cy="product-total">
        <li className="flex justify-between">
          <p className="capitalize">subtotal</p>
          <span className="text-lg font-medium">
            <span className="text-base">{currency ? currency : '$'}</span>&nbsp;{currencySymbol && currencySymbol}{cartSubTotalPrice?.toFixed(2)}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize before:content-['*'] before:text-red-500">freight</p>
          <span className="text-lg font-medium">
            <span className="text-base">{currency ? currency : '$'}</span>&nbsp;{currencySymbol && currencySymbol}{freight}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize before:content-['*'] before:text-red-500">surcharges</p>
          <span className="text-lg font-medium">
            <span className="text-base">{currency ? currency : '$'}</span>&nbsp;{currencySymbol && currencySymbol}{surcharges}
          </span>
        </li>
        <li className="flex justify-between">
          <p className="capitalize">Total Excl. GST</p>
          <span className="text-lg font-medium">
            <span className="text-base">{currency ? currency : '$'}</span>&nbsp;{currencySymbol && currencySymbol}{gst}
          </span>
        </li>
        {promoCodeApplied &&
          <li className="flex justify-between">
            <p className="capitalize">Applied Promo Code</p>
            <span className="text-lg font-medium">
              <span className="text-base">{promoCodeApplied}</span>
            </span>
          </li>
        }
        {discountPrice !== 0 &&
          <li className="flex justify-between">
            <p className="capitalize">Discounted Amount</p>
            <span className="text-lg font-medium">
              <span className="text-base">{currency ? currency : '$'} {currencySymbol && currencySymbol}{discountPrice}</span>
            </span>
          </li>
        }
      </ul>
      <div className="flex justify-between [&>p]:font-medium [&>p]:text-2xl [&>p]:text-grey-900">
        <p>Estimated Total</p>
        <p className="total_amount"><span className="text-base">{currency ? currency : '$'}&nbsp;{currencySymbol && currencySymbol}</span>{cartTotalPrice?.toFixed(2)}</p>
      </div>
      {discountPrice !== 0 &&
        <div className="flex justify-between [&>p]:font-medium [&>p]:text-2xl [&>p]:text-grey-900">
          <p>Estimated Total After Discount</p>
          <p className="total_discount"><span className="text-base">{currency ? currency : '$'}&nbsp;{currencySymbol && currencySymbol}</span>{totalPriceWithDiscount?.toFixed(2)}</p>
        </div>
      }
      {frieghtCharge && !isLoading &&
        <div className="flex gap-3 py-2 pl-2 pr-4 border-l-4 border-r-0 bg-semantic-danger-100 border-semantic-danger-500 border-y-0">
          <span className="flex items-center text-semantic-danger-500">*</span>
          <p className="text-base font-normal leading-[21px]">
            Freight, surcharges will be calculated upon reaching customer support.
          </p>
        </div>
      }
    </div>
  );
}
