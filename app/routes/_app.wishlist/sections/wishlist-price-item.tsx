import {Link} from '@remix-run/react';
import {TooltipInfo} from '~/components/icons/orderStatus';

export default function WishlistPriceItem({buyPrice}: {buyPrice: number}) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
            BUY PRICE
          </p>
          <div className="info-block">
            <p className="h-5 w-5 flex justify-center items-center ">
              <Link to="" data-tooltip="Recommended retail price">
                <span>
                  <TooltipInfo />
                </span>
              </Link>
            </p>
          </div>
        </div>
        <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
          ${buyPrice.toFixed(2)}
        </h3>
        <p className="text-[14px] font-normal leading-4">(Excl. GST)</p>
      </div>
    </div>
  );
}
