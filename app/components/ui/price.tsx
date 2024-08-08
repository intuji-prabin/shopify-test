import {TooltipInfo} from '../icons/orderStatus';

export const Price = ({
  currency,
  price,
  variant = 'base',
  currencySymbol,
  className,
}: {
  currency: string;
  price: number;
  variant?: 'base' | 'rrp';
  className?: string;
  currencySymbol?: string;
}) => {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className="flex items-center gap-1">
        <p
          className={`${
            variant === 'base' ? 'text-semantic-success-500' : 'text-grey-300'
          } text-base font-medium uppercase leading-[21px]`}
        >
          {variant === 'base' ? 'BUY PRICE' : 'rrp'}
        </p>
        <div className="info-block">
          <div className="flex items-center justify-center w-5 h-5 ">
            <div
              className="cursor-pointer"
              data-tooltip={`${
                variant === 'base'
                  ? 'Buy Price is your account specific price, including all contracted prices or discounts'
                  : 'Recommended Retail Price'
              }`}
            >
              <span>
                <TooltipInfo />
              </span>
            </div>
          </div>
        </div>
      </div>
      <h3
        className={`price leading-6 font-medium ${
          variant === 'rrp' && 'text-grey-300'
        }`}
      >
        {price ? (
          <>
            <span className="text-lg font-medium">
              {currency && currency}&nbsp;
            </span>
            {currencySymbol && currencySymbol}
            {price?.toFixed(2)}
          </>
        ) : (
          '--'
        )}
      </h3>
      <p
        className={`text-sm leading-4 ${
          variant === 'base' ? 'text-grey-500' : 'text-grey-300'
        }`}
      >
        {variant === 'base' ? '(Excl. GST)' : '(Incl. GST)'}
      </p>
    </div>
  );
};
