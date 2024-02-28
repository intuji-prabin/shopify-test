import { useState } from 'react';
import {
  CircleInformationMajor,
  Compare,
  InStock,
  Pdf,
  PickupLocation,
  ProductLoveRed,
  ProductLoveWhite,
} from '~/components/icons/orderStatus';
import { Button } from '~/components/ui/button';
import { ProductInfoTable } from './productInfoTable';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Link } from '@remix-run/react';
import CarouselThumb from './carouselThumb';
import { SliderImageData } from './slider-image-date';
import { Product } from './route';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { WarehouseInformation } from './view-warehouse-information';
import { badgeVariants } from '~/components/ui/badge';

export default function ProductInformation({ product }: { product: Product }) {
  const matches = useMediaQuery('(min-width: 1025px)');
  console.log("first", product);
  return (
    <section className="bg-white">
      <div className="container flex flex-col gap-6 lg:gap-14 lg:flex-row">
        <CarouselThumb
          images={SliderImageData}
          thumbNailCarouseloptions={{ axis: matches ? 'y' : 'x' }}
          mainCarouseloptions={{}}
        />

        <ProductDetailsSection
          productName={product?.title}
          isFavorited={false}
          productBuyPrice={0}
          productRRP={0}
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
  }
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
}: ProductDetailsProps) => {
  const [heartFill, setHeartFill] = useState(isFavorited);
  const [quantity, setQuantity] = useState(0);

  const handleHeartClick = () => {
    setHeartFill(!heartFill);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  function decreaseQuantity() {
    setQuantity(quantity - 1);
  }
  function increaseQuantity() {
    setQuantity(quantity + 1);
  }
  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value, 10);
    setQuantity(isNaN(inputQuantity) ? 0 : inputQuantity);
  }
  return (
    <div className="right-side-info flex flex-col gap-6  max-w-[unset] lg::max-w-[480px] xl:max-w-[588px] py-8">
      <div className="flex flex-col gap-6 top">
        <div className="">
          <div className="flex justify-between mb-[26px]">
            <figure>
              <img src="cigweld-logo.png" alt="" />
            </figure>
            <ul className="flex gap-[7px]">
              <li className="w-[36px] h-[36px] flex justify-center items-center border-grey-50 border-[1px]">
                <Link to="">
                  {' '}
                  <Compare />
                </Link>
              </li>
              <li className="w-[36px] h-[36px] flex justify-center items-center  border-grey-50 border-[1px]">
                <button onClick={handlePrintPDF}>
                  <Pdf />
                </button>
              </li>
              <li className="w-[36px] h-[36px] flex justify-center items-center  border-grey-50 border-[1px]">
                <button onClick={handleHeartClick}>
                  {heartFill ? <ProductLoveRed /> : <ProductLoveWhite />}
                </button>
              </li>
            </ul>
          </div>
          <div className="">
            <h3>{productName}</h3>
            <div className="flex flex-col items-baseline justify-between xl:flex-row">
              <div className="flex gap-5">
                <div className="flex items-center gap-1 text-base">
                  <p className="font-semibold leading-6 ">{sku}: </p>
                  <p className="font-normal text-Grey-500">{skuUnits}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-semibold leading-6 text-grey-600">
                    {unitOfMeasurement}:
                  </p>
                  <p className="font-normal text-Grey-500">{box}</p>
                  <Button
                    className="uppercase bg-primary-200 text-primary-500 font-medium leading-4 text-[14px] not-italic hover:text-white"
                    size="default"
                  >
                    {defaultButton}
                  </Button>
                </div>
              </div>
              <div className={`${badgeVariants({ variant: 'inStock' })} !m-0 `}>
                <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>
                IN STOCK
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-3 lg:gap-8 lg:flex-row ">
              <ProductCardInfo
                productName={
                  'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
                }
                buyPrice={649.22}
                rppPrice={799.87}
                buyPriceTitle={'BUY PRICE'}
                exclGst={'Excl. GST'}
                rppTitle={'RRP'}
                incGst={'Inc. GST'}
                minimumOrder={'Minimum Order'}
                minimumPieces={'(500 pieces'}
              />

              <ProductInfoTable quantity={'Quantity'} price={'Price'} />
            </div>
            <div className="flex gap-2 px-4 py-2 mb-2 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
              <CircleInformationMajor />
              <p className="text-base font-normal leading-[21px]">
                Price will change if you increase quantity of items.
              </p>
            </div>
          </div>
          <div className="flex flex-col min-h-0 gap-4 lg:flex-row lg:min-h-14">
            <div className="flex">
              <button
                className=" border-[1px] border-grey-500  flex justify-center items-center w-[56px]"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <input
                type="text"
                className=" max-w-[61px] h-full text-center border-x-0 border-[1px] border-grey-500"
                value={quantity}
                onChange={handleInputChange}
              />
              <button
                className="border-[1px] border-grey-500  flex justify-center items-center  w-[56px]"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
            <SelectACountryDropdown defaultUOM={box} unitOfMeasure={unitOfMeasure} />
            <Button className="flex-grow uppercase" variant="primary">
              {addToCart}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex max-w-[483px] gap-2">
        <PickupLocation />
        <div>
          <p>
            {pickupStatus} <span className="upperase">{pickupAddress}</span>
          </p>
          <p>{arrivalTime}</p>
          <WarehouseInformation
            warehouseLink={'View WAREHOUSE information'}
            pickupTitle={'Pick Availability'}
          />
        </div>
      </div>
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
}: ProductCardInfoProps) {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="tag flex flex-col gap-[11px]">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                {buyPriceTitle}
              </p>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
              ${buyPrice}
            </h3>
            <p className="text-[14px] font-normal leading-4">{exclGst}</p>
          </div>
          <div className="flex flex-col pl-6 border-l-2 border-r-0 border-grey-50 border-y-0">
            <div className="flex items-center ">
              <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                {rppTitle}
              </p>
            </div>
            <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
              ${rppPrice}
            </h3>
            <p className="text-[14px] font-normal leading-4">{incGst}</p>
          </div>
        </div>
      </div>
      <p className="text-lg font-normal leading-[22px]">
        {minimumOrder} ({minimumPieces})
      </p>
    </div>
  );
}

export function SelectACountryDropdown({ unitOfMeasure, defaultUOM }: {
  unitOfMeasure: {
    unit: string;
    conversion_factor: number;
  }, defaultUOM: string
}) {
  const [uom, setUom] = useState(defaultUOM);
  return (
    <div className="flex flex-col">
      <select
        name="filter_by"
        className="w-full min-w-[116px] place-order h-full border-grey-500!border-grey-100 filter-select"
        onChange={(e) => setUom(e.target.value)}
        defaultValue={uom}
      >
        {unitOfMeasure.length > 0 ? unitOfMeasure?.map((uom: any, index: number) => (
          <option value={uom.unit} key={index + 'uom'}>
            {uom.unit}
          </option>
        )) : <option value={defaultUOM}>
          {defaultUOM}
        </option>}
      </select>
    </div>
  );
}
