import {TooltipInfo} from '../icons/orderStatus';

export const Price = ({
  currency,
  price,
  variant = 'base',
}: {
  currency: string;
  price: number;
  variant?: 'base' | 'rrp';
}) => {
  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-1">
        <p
          className={`${
            variant === 'base' ? 'text-semantic-success-500' : 'text-grey-300'
          } text-base font-bold uppercase leading-[21px]`}
        >
          {variant === 'base' ? 'BUY PRICE' : 'rrp'}
        </p>
        <div className="info-block">
          <p className="flex items-center justify-center w-5 h-5 ">
            <div
              className="cursor-pointer"
              data-tooltip={`${
                variant === 'base'
                  ? 'Buy Price is your account specific price, including all contracted prices or discounts'
                  : 'Recommended retail price'
              }`}
            >
              <span>
                <TooltipInfo />
              </span>
            </div>
          </p>
        </div>
      </div>
      <h3 className="leading-[36px]">
        <span className="text-lg font-medium">
          {currency ? currency : '$'}{' '}
        </span>
        {(price && price?.toFixed(2)) || 'N/A'}
      </h3>
      <p className="text-sm leading-4">
        {variant === 'base' ? '(Excl. GST)' : '(inc. GST)'}
      </p>
    </div>
  );
};
