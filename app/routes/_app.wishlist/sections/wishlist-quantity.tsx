import {Link} from '@remix-run/react';
import {useState} from 'react';
import {TooltipInfo} from '~/components/icons/orderStatus';

export default function WishlistQuantity({count}: {count: number}) {
  const [quantity, setQuantity] = useState(count);

  function decreaseQuantity() {
    setQuantity(quantity - 1);
  }
  function increaseQuantity() {
    setQuantity(quantity + 1);
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <button
          className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <p className="border-y border-solid border-grey-200 flex items-center justify-center min-h-10 w-10">
          {quantity}
        </p>
        <button
          className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
          onClick={increaseQuantity}
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-1">
        <div className="info-block">
          <p className="h-5 w-5 flex justify-center items-center ">
            <Link to="" data-tooltip="Recommended retail price">
              <span>
                <TooltipInfo fillColor="#0092CF" />
              </span>
            </Link>
          </p>
        </div>
        <p className="text-grey-700 text-[14px] font-normal capitalize  leading-[16px]">
          Minimum Order Quantity
        </p>
      </div>
    </div>
  );
}
