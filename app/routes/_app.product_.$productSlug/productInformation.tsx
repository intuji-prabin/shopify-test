import { Form, Link, useSubmit } from '@remix-run/react';
import { useState } from 'react';
import {
  CircleInformationMajor,
  Compare,
  Pdf,
  PickupLocation,
  ProductLoveRed,
  ProductLoveWhite,
  TooltipInfo,
} from '~/components/icons/orderStatus';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import CarouselThumb from './carouselThumb';
import { getProductPriceByQty } from './product-detail';
import { ProductInfoTable } from './productInfoTable';
import { WarehouseInformation } from './view-warehouse-information';
import Info from '~/components/icons/info';

export default function ProductInformation({ product, wishListItems }: any) {
  const matches = useMediaQuery('(min-width: 1025px)');
  function checkProductIdExists(productId: number) {
    return wishListItems?.some((item: any) => item?.productId === productId);
  }
  const volumePrice = product?.priceRange?.length > 0 ? true : false;

  return (
    <section className="bg-white">
      <div className="flex flex-col flex-wrap items-start gap-6 px-6 lg:gap-14 lg:flex-row">
        {product?.imageUrl?.length > 0 && (
          <div className="w-full lg:w-[calc(50%_-_28px)] pt-6 pb-8">
            <CarouselThumb
              images={product?.imageUrl}
              thumbNailCarouseloptions={{ axis: matches ? 'y' : 'x' }}
              mainCarouseloptions={{}}
              volumePrice={volumePrice}
            />
          </div>
        )}

        <ProductDetailsSection
          productImageLength={product?.imageUrl?.length}
          productName={product?.title}
          productId={product?.id}
          productVariantId={product?.variantId}
          isFavorited={checkProductIdExists(product?.id)}
          sku={'Sku'}
          skuUnits={product?.supplierSku}
          unitOfMeasurement={'Unit Of Measurement:'}
          box={product?.uom}
          unitOfMeasure={product?.unitOfMeasure}
          isInStock={false}
          defaultButton={'Default'}
          addToCart={'Add to cart'}
          pickupStatus={'Pickup available at '}
          pickupAddress={' SUPERCHEAP AUTO NZ PTY LTD'}
          arrivalTime={'Usually ready in 4 hours'}
          priceRange={product?.priceRange}
          companyDefaultPrice={product?.companyDefaultPrice}
          originalPrice={product?.originalPrice}
          moq={product?.moq}
          uomCode={product?.uomCode}
          currency={product?.currency}
        />
      </div>
    </section>
  );
}

type ProductDetailsProps = {
  productName: string;
  isFavorited: boolean;
  productBuyPrice: number;
  productRRP: number;
  sku: string;
  skuUnits: string;
  unitOfMeasurement: string;
  box: string;
  isInStock: boolean;
  defaultButton: string;
  addToCart: string;
  pickupStatus: string;
  pickupAddress: string;
  arrivalTime: string;
  unitOfMeasure: {
    unit: string;
    conversion_factor: number;
  };
  priceRange?: any;
};
const ProductDetailsSection = ({
  productName,
  isFavorited,
  sku,
  skuUnits,
  unitOfMeasurement,
  box,
  defaultButton,
  isInStock,
  addToCart,
  pickupStatus,
  pickupAddress,
  arrivalTime,
  unitOfMeasure,
  priceRange,
  companyDefaultPrice,
  originalPrice,
  productId,
  productVariantId,
  productImageLength,
  moq,
  uomCode,
  currency
}: any) => {
  const [quantity, setQuantity] = useState(parseFloat(moq) || 1);
  const [productPrice, setProductPrice] = useState(companyDefaultPrice);
  const [UOM, setUOM] = useState(uomCode);
  const submit = useSubmit();

  function decreaseQuantity() {
    const prices = getProductPriceByQty(
      quantity > 1 ? quantity - 1 : 1,
      unitOfMeasure,
      UOM,
      box,
      priceRange,
      companyDefaultPrice,
    );
    setProductPrice(prices);
    setQuantity(quantity > 0 ? quantity - 1 : 0);
  }
  function increaseQuantity() {
    const prices = getProductPriceByQty(
      quantity + 1,
      unitOfMeasure,
      UOM,
      box,
      priceRange,
      companyDefaultPrice,
    );
    setProductPrice(prices);
    setQuantity(quantity + 1);
  }
  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    const prices = getProductPriceByQty(
      isNaN(inputQuantity) ? 0 : inputQuantity,
      unitOfMeasure,
      UOM,
      box,
      priceRange,
      companyDefaultPrice,
    );
    setProductPrice(prices);
    setQuantity(isNaN(inputQuantity) ? 0 : inputQuantity);
  }

  function handleUOM(selectedUOM: any) {
    const prices = getProductPriceByQty(
      quantity,
      unitOfMeasure,
      selectedUOM,
      box,
      priceRange,
      companyDefaultPrice,
    );
    setProductPrice(prices);
    setUOM(selectedUOM);
  }

  return (
    <div
      className={`w-full ${productImageLength > 0 && 'lg:w-[calc(50%_-_28px)]'
        } py-8`}
    >
      <div className="flex justify-between">
        <figure>
          <img src="/cigweld-logo.png" alt="" className="max-h-7" />
        </figure>
        <ul className="flex gap-[7px]">
          <li className="w-[36px] h-[36px] flex justify-center items-center border-grey-50 border-[1px]">
            <Link to="">
              {' '}
              <Compare />
            </Link>
          </li>
          <li className="w-[36px] h-[36px] flex justify-center items-center  border-grey-50 border-[1px]">
            <Form method={isFavorited ? 'DELETE' : 'POST'} className='flex'>
              <input type="hidden" name="productId" value={productId} />
              <button value={isFavorited ? "removeFromWishList" : "addToWishList"} name="action">
                {isFavorited ? <ProductLoveRed /> : <ProductLoveWhite />}
              </button>
            </Form>
          </li>
        </ul>
      </div>
      <h3 className="pt-4">{productName}</h3>
      <div className="flex flex-col justify-between pt-4 sm:flex-row gap-y-2">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <div className="flex items-center gap-1 text-base">
            <p className="font-semibold leading-6 ">{sku}: </p>
            <p className="font-normal text-Grey-500">{skuUnits || "N/A"}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold leading-6 text-grey-600">
              {unitOfMeasurement}
            </p>
            <p className="font-normal text-Grey-500">{box}</p>
            <div className={`${badgeVariants({ variant: 'primary' })} !m-0`}>
              {defaultButton}
            </div>
          </div>
        </div>
        <div className={`${badgeVariants({ variant: 'inStock' })} !m-0 w-max`}>
          <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>
          IN STOCK
        </div>
      </div>
      <ProductCardInfo
        className="mt-6 product_det__pricing"
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
        }
        buyPrice={productPrice}
        rppPrice={originalPrice}
        buyPriceTitle={'BUY PRICE'}
        exclGst={'Excl. GST'}
        rppTitle={'RRP'}
        incGst={'Inc. GST'}
        minimumOrder={'Minimum Order'}
        minimumPieces={moq}
        currency={currency}
      />
      {priceRange && priceRange.length > 0 && (
        <div className="w-full pt-4">
          <ProductInfoTable
            quantity={'Quantity'}
            price={'Price'}
            volumePrice={priceRange}
            className="product_det__table"
          />
        </div>
      )}
      <div className="flex gap-2 px-4 py-2 mt-6 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
        <CircleInformationMajor />
        <p className="text-base font-normal leading-[21px]">
          Price will change if you increase quantity of items.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row">
        <div>
          <div className="flex">
            <button
              className="border-[1px] border-grey-500 flex justify-center items-center w-14 aspect-square"
              onClick={decreaseQuantity}
            >
              -
            </button>
            <input
              type="text"
              className="max-w-[61px] min-h-14 h-full text-center border-x-0 !border-grey-500"
              value={quantity}
              onChange={handleInputChange}
            />
            <button
              className="border-[1px] border-grey-500  flex justify-center items-center aspect-square w-14"
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>
          <p className='text-sm text-grey-700 pt-2.5 flex gap-x-1'>
            <Info />
            Minimum Order Quantity {moq || 1}
          </p>
        </div>
        <div className="flex flex-col">
          <select
            name="filter_by"
            className="w-full min-w-[120px] min-h-14 place-order h-full !border-grey-500 filter-select"
            onChange={(e: any) => handleUOM(e.target.value)}
            defaultValue={UOM}
          >
            {unitOfMeasure.length > 0 ? (
              unitOfMeasure?.map((uom: any, index: number) => (
                <option value={uom.code} key={index + 'uom'}>
                  {uom.unit}
                </option>
              ))
            ) : (
              <option value={UOM}>{box}</option>
            )}
          </select>
        </div>
        <Form
          method="POST"
          className="w-full"
          onSubmit={(event) => {
            submit(event.currentTarget);
          }}
        >
          <input type="hidden" name="productId" value={productId} />
          <input
            type="hidden"
            name="productVariantId"
            value={productVariantId}
          />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="selectUOM" value={UOM} />
          {quantity < moq || quantity < 1 ?
            <>
              <button
                className="flex items-center justify-center w-full gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-not-allowed text-grey-400 bg-grey-200 min-h-14"
                disabled
              >
                {addToCart}
              </button>
              <p className='text-red-500'>Minimum order quantity is {moq || 1}</p>
            </>
            : <Button
              className="flex-grow w-full uppercase min-h-14"
              variant="primary"
              type="submit"
              value="addToCart"
              name="action"
            >
              {addToCart}
            </Button>
          }
        </Form>
      </div>
      {/* <div className="flex max-w-[483px] gap-2 pt-6">
        <PickupLocation />
        <div>
          <p>
            {pickupStatus}{' '}
            <span className="italic uppercase bold">{pickupAddress}</span>
          </p>
          <p className="pb-2">{arrivalTime}</p>
          <WarehouseInformation
            warehouseLink={'View WAREHOUSE information'}
            pickupTitle={'Pick Availability'}
          />
        </div>
      </div> */}
    </div>
  );
};

type ProductCardInfoProps = {
  buyPriceTitle: string;
  productName: string;
  buyPrice: number;
  rppPrice: number;
  exclGst: string;
  rppTitle: string;
  incGst: string;
  minimumOrder: string;
  minimumPieces: string;
  className?: string;
  currency?: string;
};
export function ProductCardInfo({
  productName,
  buyPrice,
  rppPrice,
  rppTitle,
  buyPriceTitle,
  exclGst,
  incGst,
  minimumOrder,
  minimumPieces,
  className,
  currency
}: ProductCardInfoProps) {
  return (
    <div className={`flex flex-col gap-6 p-4 ${className}`}>
      <div className="tag flex flex-col gap-[11px]">
        <div className="flex flex-wrap gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-semantic-success-500 text-base font-medium uppercase leading-[21px]">
                {buyPriceTitle}
              </p>
              <div className="info-block">
                <p className="flex items-center justify-center w-5 h-5 ">
                  <div className='cursor-pointer' data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts">
                    <span>
                      <TooltipInfo />
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727] price">
              <span className='text-lg font-medium'>{currency ? currency : '$'}</span>&nbsp;{buyPrice?.toFixed(2)}
            </h3>
            <p className="text-[14px] font-normal leading-4 pt-1">({exclGst})</p>
          </div>
          <div className="flex flex-col pl-6 border-l-2 border-r-0 border-grey-50 border-y-0">
            <div className="flex items-center gap-1">
              <p className="text-grey-300 not-italic text-base font-medium uppercase leading-[21px]">
                {rppTitle}
              </p>
              <div className="info-block">
                <p className="flex items-center justify-center w-5 h-5 ">
                  <div className='cursor-pointer'
                    data-tooltip="Recommended retail price"
                  >
                    <span>
                      <TooltipInfo />
                    </span>
                  </div>
                </p>
              </div>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300 price">
              <span className='text-lg font-medium'>{currency ? currency : '$'}</span>&nbsp;{rppPrice?.toFixed(2)}
            </h3>
            <p className="text-[14px] font-normal leading-4 pt-1">({incGst})</p>
          </div>
        </div>
      </div>
      <p className="text-lg font-normal leading-[22px]">
        {minimumOrder} ({minimumPieces})
      </p>
    </div>
  );
}