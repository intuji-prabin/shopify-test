import {useState} from 'react';
import {
  CircleInformationMajor,
  Compare,
  InStock,
  Pdf,
  PickupLocation,
  ProductLoveRed,
  ProductLoveWhite,
} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {ProductInfoTable} from './productInfoTable';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {Link} from '@remix-run/react';
import CarouselThumb from './carouselThumb';
import {SliderImageData} from './slider-image-date';
import {Product} from './route';
import {useMediaQuery} from '../../hooks/useMediaQuery';
import {WarehouseInformation} from './view-warehouse-information';
import {badgeVariants} from '~/components/ui/badge';

export default function ProductInformation({product}: {product: Product}) {
  const matches = useMediaQuery('(min-width: 1025px)');
  return (
    <section className="bg-white">
      <div className="container flex gap-6 lg:gap-14 flex-col lg:flex-row">
        <CarouselThumb
          images={SliderImageData}
          thumbNailCarouseloptions={{axis: matches ? 'y' : 'x'}}
          mainCarouseloptions={{}}
        />

        <ProductDetailsSection
          productName={
            'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
          }
          isFavorited={false}
          productBuyPrice={0}
          productRRP={0}
          sku={'Sku'}
          skuUnits={'1-1601-EC'}
          unitOfMeasurement={'Unit Of Measurement:'}
          box={'1 Box'}
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
    <>
      <div className="right-side-info flex flex-col gap-6  max-w-[unset] lg::max-w-[480px] xl:max-w-[588px] py-8">
        <div className="top flex flex-col gap-6">
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
              <div className="flex justify-between flex-col xl:flex-row items-baseline">
                <div className="flex gap-5">
                  <div className="flex text-base items-center gap-1">
                    <p className=" font-semibold leading-6">{sku}: </p>
                    <p className="text-Grey-500 font-normal">{skuUnits}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold leading-6 text-grey-600">
                      {unitOfMeasurement}:
                    </p>
                    <p className="text-Grey-500 font-normal">{box}</p>
                    <Button
                      className="uppercase bg-primary-200 text-primary-500 font-medium leading-4 text-[14px] not-italic hover:text-white"
                      size="default"
                    >
                      {defaultButton}
                    </Button>
                  </div>
                </div>
                <div className={`${badgeVariants({variant: 'inStock'})} !m-0 `}>
                  <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>
                  IN STOCK
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex gap-3 lg:gap-8 flex-col lg:flex-row ">
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
              <div className="py-2 px-4 bg-semantic-info-100 flex gap-2 border-semantic-info-500 border-l-4 border-y-0 border-r-0 mb-2">
                <CircleInformationMajor />
                <p className="text-base font-normal leading-[21px]">
                  Price will change if you increase quantity of items.
                </p>
              </div>
            </div>
            <div className="flex gap-4 flex-col lg:flex-row min-h-0 lg:min-h-14">
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
              <SelectACountryDropdown />
              <Button className="uppercase flex-grow" variant="primary">
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
    </>
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
    <>
      <div className="p-4 flex flex-col gap-6">
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
            <div className="flex flex-col border-grey-50 border-l-2 border-y-0 border-r-0 pl-6">
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
    </>
  );
}

export function SelectACountryDropdown() {
  return (
    <div className="flex flex-col">
      <Select>
        <SelectTrigger className="min-w-[116px] place-order rounded-sm country h-full  border-[1px] border-grey-500 ">
          <SelectValue placeholder="UDM" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="pieces">Pieces</SelectItem>
            <SelectItem value="boxes">Boxes</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
