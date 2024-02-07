import {Link} from '@remix-run/react';
import {useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import {TooltipInfo} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
type ProductImage = {
  imageUrl: string;
  isFavourited: boolean;
};
type ProductCardInfoProps = {
  productName: string;
  buyPrice: number;
  rppPrice: number;
};
export type CompareproductProps = ProductImage & ProductCardInfoProps;
export default function CompareDefaultItem({
  imageUrl,
  productName,
  buyPrice,
  rppPrice,
  isFavourited,
}: CompareproductProps) {
  const [heartFill, setHeartFill] = useState(isFavourited);

  const handleHeartClick = () => {
    setHeartFill(!heartFill);
  };

  return (
    <>
      <div className="min-w-[132px] md:min-w-[unset]">
        <div
          className={`relative p-5 border-grey-25 border-b-2 border-x-0 border-top-0 bg-grey-25  h-[175px] md:h-[261px] md:px-11 md:py-[39px]
          }`}
        >
          <figure>
            {' '}
            <img
              src={imageUrl}
              className="max-h-[138px] md:max-h-[unset]"
              alt="product-image"
            />
            <Button
              className="absolute top-2 right-2 bg-white max-h-5 max-w-5 md:max-h-8 md:max-w-8 p-[3px] md:p-2 hover:bg-white"
              onClick={handleHeartClick}
            >
              <CloseMenu fillColor="#0F1010" />
            </Button>
          </figure>
        </div>
        <div className="p-4 flex flex-col gap-6 ">
          <div className="tag flex flex-col gap-[11px]">
            <div>
              <h5 className="text-lg italic font-bold leading-6 text-grey-900 line-clamp-2 text-ellipsis whitespace-normal h-12">
                {productName}
              </h5>
            </div>
            <div className="flex gap-2 md:gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
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
                <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                  ${buyPrice.toFixed(2)}
                </h3>
                <p className="text-[14px] font-normal leading-4">(Excl. GST)</p>
              </div>
              <div className="flex flex-col  pl-1 md:pl-6">
                <div className="flex items-center ">
                  <p className="text-grey-300 not-italic text-sm md:text-base font-bold uppercase leading-[21px]">
                    rrp
                  </p>
                  <div className="info-block">
                    <p className="h-5 w-5 flex justify-center items-center ">
                      <Link
                        to=""
                        data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                      >
                        <span>
                          <TooltipInfo />
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
                <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-grey-300">
                  ${rppPrice.toFixed(2)}
                </h3>
                <p className="text-[14px] font-normal leading-4">(inc. GST)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
