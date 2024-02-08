import { Link } from '@remix-run/react';
import { useState } from 'react';
import {
  ProductLoveRed,
  ProductLoveWhite,
  TooltipInfo,
} from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';

export type ProductCardProps = ProductCardImageProps & ProductCardInfoProps;

export function ProductCard({
  // buyPrice,
  isBuyQtyAvailable,
  isFavorited,
  // productImageUrl,
  title,
  // rppPrice,
  variants,
  featuredImageUrl,
  imageBackgroundColor,
}: ProductCardProps) {
  return (
    <>
      <div className="single-product-card">
        {/* <ProductCardImage
          isBuyQtyAvailable={isBuyQtyAvailable}
          isFavorited={isFavorited}
          productImageUrl={productImageUrl}
          imageBackgroundColor={imageBackgroundColor}
        /> */}
        <ProductCardImage
          isBuyQtyAvailable={isBuyQtyAvailable}
          isFavorited={isFavorited}
          featuredImageUrl={featuredImageUrl}
          imageBackgroundColor={imageBackgroundColor}
        />
        <ProductCardInfo
          sku={variants?.sku}
          productName={title}
        // buyPrice={buyPrice}
        // rppPrice={rppPrice}
        />
      </div>
    </>
  );
}

type ProductCardInfoProps = {
  variants: VariantType;
  title: string;
};

type VariantType = {
  sku: string;
}

type ProductCardImageProps = {
  isBuyQtyAvailable: boolean;
  isFavorited: boolean;
  imageBackgroundColor: string;
  featuredImageUrl: string;
};

export function ProductCardInfo({
  sku,
  productName,
  // buyPrice,
  // rppPrice,
}: any) {
  return (
    <>
      <div className="flex flex-col gap-6 p-4">
        <div className="tag flex flex-col gap-[11px]">
          <div>
            <p className="text-base font-medium text-primary-500 sku">
              SKU:{sku}
            </p>
            <h5 className="h-12 text-lg italic font-bold leading-6 whitespace-normal text-grey-900 line-clamp-2 text-ellipsis">
              {productName}
            </h5>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                  BUY PRICE
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
                    <Link to="" data-tooltip="Recommended retail price">
                      <span>
                        <TooltipInfo />
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
                {/* ${buyPrice.toFixed(2)} */}
              </h3>
              <p className="text-[14px] font-normal leading-4">(Excl. GST)</p>
            </div>
            <div className="flex flex-col pl-6 border-l-2 border-r-0 border-grey-50 border-y-0">
              <div className="flex items-center ">
                <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                  rrp
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
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
              <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
                {/* ${rppPrice.toFixed(2)} */}
              </h3>
              <p className="text-[14px] font-normal leading-4">(inc. GST)</p>
            </div>
          </div>
        </div>
        <ProductCardButtons />
      </div>
    </>
  );
}

function ProductCardImage({
  featuredImageUrl,
  isBuyQtyAvailable,
  isFavorited,
  imageBackgroundColor,
}: ProductCardImageProps) {
  const [heartFill, setHeartFill] = useState(isFavorited);
  const [isBuyQtyAvailableState, setIsBuyQtyAvailable] =
    useState(isBuyQtyAvailable);

  const handleHeartClick = () => {
    setHeartFill(!heartFill);
  };

  return (
    <div
      className={`relative px-11 py-[39px] border-grey-25 border-b-2 border-x-0 border-top-0 ${imageBackgroundColor ? `bg-[${imageBackgroundColor}]` : ''
        }`}
    >
      {isBuyQtyAvailableState && (
        <div className="bg-secondary-500 px-2 py-1 text-grey-900 uppercase absolute top-0 left-0 text-base italic font-normal leading-[19px]">
          QTY Buy Available
        </div>
      )}
      <button className="absolute top-2 right-2" onClick={handleHeartClick}>
        {heartFill ? <ProductLoveRed /> : <ProductLoveWhite />}
      </button>
      <figure className="mt-3">
        <img src={featuredImageUrl} className="" alt="product-image" />
      </figure>
    </div>
  );
}

function ProductCardButtons() {
  function handleViewDetail() {
    console.log('view detail');
  }

  function handleAddToCart() {
    console.log('add to cart');
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row product-button">
      <Button
        variant="primary"
        size="default"
        className="w-full"
        onClick={handleViewDetail}
      >
        {' '}
        view detail
      </Button>

      <Button
        variant="ghost"
        size="default"
        className="w-full"
        onClick={handleAddToCart}
      >
        Add to cart
      </Button>
    </div>
  );
}
