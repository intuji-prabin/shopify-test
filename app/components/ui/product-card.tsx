import { Form, Link, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import {
  ProductLoveRed,
  ProductLoveWhite,
  TooltipInfo,
} from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';

export type ProductCardProps = ProductCardImageProps & ProductCardInfoProps;

export function ProductCard({
  volumePrice,
  title,
  companyPrice,
  defaultPrice,
  variants,
  featuredImageUrl,
  imageBackgroundColor,
  handle,
  id,
  uom,
  wishListItems,
  currency
}: ProductCardProps) {
  function checkProductIdExists(productId: number) {
    return wishListItems?.some((item: any) => item?.productId === productId);
  }

  return (
    <div className="bg-white single-product-card">
      <div className="relative h-full">
        <ProductCardImage
          volumePrice={volumePrice}
          isFavorited={checkProductIdExists(id)}
          featuredImageUrl={featuredImageUrl}
          imageBackgroundColor={imageBackgroundColor}
          productId={id}
        />
        <ProductCardInfo
          sku={variants?.sku}
          productName={title}
          companyPrice={companyPrice}
          defaultPrice={defaultPrice}
          currency={currency}
          handle={handle}
          id={id}
          uom={uom}
          productVariantId={variants?.id}
          moq={variants?.moq}
        />
      </div>
    </div>
  );
}

type ProductCardInfoProps = {
  variants: VariantType;
  title: string;
  defaultPrice?: string;
  companyPrice?: string;
  handle: string;
  id: number;
  uom: string;
  wishListItems?: any;
  currency: string;
  volumePrice?: boolean;
};

type VariantType = {
  sku: string;
  id: number;
  moq: number;
};

type ProductCardImageProps = {
  isBuyQtyAvailable: boolean;
  isFavorited: boolean;
  imageBackgroundColor: string;
  featuredImageUrl: string;
  productId: number;
};

export function ProductCardInfo({
  sku,
  productName,
  defaultPrice,
  companyPrice,
  handle,
  id,
  uom,
  productVariantId,
  moq,
  currency,
}: // buyPrice,
  // rppPrice,
  any) {
  return (
    <div className="p-4">
      <div className="sm:pb-[66px]">
        <div>
          <p className="text-base font-medium text-primary-500 sku">
            SKU:&nbsp;{(sku && sku) || 'N/A'}
          </p>
          <h5 className="text-lg italic font-bold leading-6 whitespace-normal max-h-12 text-grey-900 line-clamp-2 text-ellipsis">
            <Link to={`/product/${handle}`}>{productName}</Link>
          </h5>
          <p className="text-sm text-grey-300">Minimum Order Quantity: {moq}</p>
        </div>
        <div className="flex flex-wrap gap-6 mt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                BUY PRICE
              </p>
              <div className="info-block">
                <p className="flex items-center justify-center w-5 h-5 ">
                  <div
                    className="cursor-pointer"
                    data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                  >
                    <span>
                      <TooltipInfo />
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
              <span className="text-lg font-medium">{currency ? currency : '$'} </span>
              {(companyPrice && companyPrice?.toFixed(2)) || 'N/A'}
            </h3>
            <p className="text-[14px] font-normal leading-4">(Excl. GST)</p>
          </div>
          <div className="flex flex-col pl-6 border-l-2 border-r-0 border-grey-50 border-y-0">
            <div className="flex items-center gap-1">
              <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                rrp
              </p>
              <div className="info-block">
                <p className="flex items-center justify-center w-5 h-5 ">
                  <div
                    className="cursor-pointer"
                    data-tooltip="Recommended retail price"
                  >
                    <span>
                      <TooltipInfo />
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
              <span className="text-lg font-medium">{currency ? currency : '$'} </span>{(defaultPrice && defaultPrice?.toFixed(2)) || 'N/A'}
            </h3>
            <p className="text-[14px] font-normal leading-4">(inc. GST)</p>
          </div>
        </div>
        <div className="sm:absolute bottom-4 inset-x-4">
          <ProductCardButtons
            handle={handle}
            id={id}
            uom={uom}
            moq={moq}
            productVariantId={productVariantId}
          />
        </div>
      </div>
    </div>
  );
}

function ProductCardImage({
  featuredImageUrl,
  volumePrice,
  isFavorited,
  imageBackgroundColor,
  productId,
}: ProductCardImageProps) {
  const [heartFill, setHeartFill] = useState(isFavorited);
  // const [isBuyQtyAvailableState, setIsBuyQtyAvailable] =
  //   useState(isBuyQtyAvailable);

  const handleHeartClick = () => {
    setHeartFill(!heartFill);
  };

  return (
    <div
      className={`relative px-11 py-[39px] flex justify-center border-grey-25 border-b-2 border-x-0 border-top-0 ${imageBackgroundColor ? `bg-[${imageBackgroundColor}]` : ''
        }`}
    >
      {volumePrice && (
        <div className="bg-secondary-500 px-2 py-1 text-grey-900 uppercase absolute top-0 left-0 text-base italic font-normal leading-[19px]">
          QTY Buy Available
        </div>
      )}
      <Form method={isFavorited ? 'DELETE' : 'POST'} className="flex">
        <input type="hidden" name="productId" value={productId} />
        <button
          className="absolute top-2 right-2"
          value={isFavorited ? 'removeFromWishList' : 'addToWishList'}
          name="action"
        >
          {isFavorited ? <ProductLoveRed /> : <ProductLoveWhite />}
        </button>
      </Form>
      <figure className="mt-3">
        <img
          src={featuredImageUrl}
          className="object-contain h-48 max-h-48"
          alt={featuredImageUrl}
        />
      </figure>
    </div>
  );
}

function ProductCardButtons({
  handle,
  id,
  uom,
  productVariantId,
  moq,
}: {
  handle: string;
  id: number;
  uom: string;
  productVariantId: string;
  moq: number;
}) {
  const submit = useSubmit();
  const productVariantOnlyId = productVariantId.split('/').pop();

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-6 sm:flex-row product-button">
      <Link
        to={`/product/${handle}`}
        className="flex items-center justify-center w-full gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border-solid cursor-pointer text-neutral-white bg-primary-500 hover:bg-primary-600"
      >
        view detail
      </Link>

      <Form
        method="POST"
        onSubmit={(event) => {
          submit(event.currentTarget);
        }}
        className="w-full"
      >
        <input type="hidden" name="productId" value={id} />
        <input
          type="hidden"
          name="productVariantId"
          value={productVariantOnlyId}
        />
        <input type="hidden" name="quantity" value={moq} />
        <input type="hidden" name="selectUOM" value={uom} />
        <Button
          variant="ghost"
          size="default"
          type="submit"
          value="addToCart"
          name="action"
        >
          Add to cart
        </Button>
      </Form>
    </div>
  );
}
