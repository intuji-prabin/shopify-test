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
  // buyPrice,
  isBuyQtyAvailable,
  isFavorited,
  // productImageUrl,
  title,
  // rppPrice,
  companyPrice,
  defaultPrice,
  variants,
  featuredImageUrl,
  imageBackgroundColor,
  handle,
  id,
  uom
}: ProductCardProps) {

  return (
    <div className="bg-white single-product-card">
      <div className="relative h-full">
        <ProductCardImage
          isBuyQtyAvailable={isBuyQtyAvailable}
          isFavorited={isFavorited}
          featuredImageUrl={featuredImageUrl}
          imageBackgroundColor={imageBackgroundColor}
        />
        <ProductCardInfo
          sku={variants?.sku}
          productName={title}
          companyPrice={companyPrice}
          defaultPrice={defaultPrice}
          handle={handle}
          id={id}
          uom={uom}
          productVariantId={variants?.id}
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
};

type VariantType = {
  sku: string;
  id: number;
};

type ProductCardImageProps = {
  isBuyQtyAvailable: boolean;
  isFavorited: boolean;
  imageBackgroundColor: string;
  featuredImageUrl: string;
};

export function ProductCardInfo({
  sku,
  productName,
  defaultPrice,
  companyPrice,
  handle,
  id,
  uom,
  productVariantId
}: // buyPrice,
  // rppPrice,
  any) {
  return (
    <div className="p-4">
      <div className="sm:pb-[146px]">
        <div>
          <p className="text-base font-medium text-primary-500 sku">
            SKU:&nbsp;{sku && sku || "N/A"}
          </p>
          <h5 className="text-lg italic font-bold leading-6 whitespace-normal max-h-12 text-grey-900 line-clamp-2 text-ellipsis">
            <Link to={handle}>
              {productName}
            </Link>
          </h5>
        </div>
        <div className="mt-3 sm:absolute bottom-4 inset-x-4">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                  BUY PRICE
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
                    <div className='cursor-pointer' data-tooltip="Recommended retail price">
                      <span>
                        <TooltipInfo />
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
                ${companyPrice && companyPrice || "N/A"}
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
                    <div className='cursor-pointer'
                      data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                    >
                      <span>
                        <TooltipInfo />
                      </span>
                    </div>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
                ${defaultPrice && defaultPrice || "N/A"}
              </h3>
              <p className="text-[14px] font-normal leading-4">(inc. GST)</p>
            </div>
          </div>
          <ProductCardButtons handle={handle} id={id} uom={uom} productVariantId={productVariantId} />
        </div>
      </div>
    </div>
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
      className={`relative px-11 py-[39px] flex justify-center border-grey-25 border-b-2 border-x-0 border-top-0 ${imageBackgroundColor ? `bg-[${imageBackgroundColor}]` : ''
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
        <img src={featuredImageUrl} className="max-h-48" alt="product-image" />
      </figure>
    </div>
  );
}

function ProductCardButtons({ handle, id, uom, productVariantId }: { handle: string, id: number, uom: string, productVariantId: string }) {
  const submit = useSubmit();
  const productVariantOnlyId = productVariantId.split('/').pop();

  return (
    <div className="flex flex-col items-center justify-center gap-2 mt-6 sm:flex-row product-button">
      <Link to={handle}
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
        <input type="hidden" name='productId' value={id} />
        <input type="hidden" name='productVeriantId' value={productVariantOnlyId} />
        <input type="hidden" name='quantity' value='1' />
        <input type="hidden" name='selectUOM' value={uom} />
        <Button variant="ghost"
          size="default"
          type='submit'>
          Add to cart
        </Button>
      </Form>
    </div>
  );
}