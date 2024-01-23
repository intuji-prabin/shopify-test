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

export default function ProductInformation({product}: {product: Product}) {
  const matches = useMediaQuery('(min-width: 1025px)');
  return (
    <section className="bg-white">
      <div className="container flex gap-14 flex-col lg:flex-row">
        <CarouselThumb
          images={SliderImageData}
          thumbNailCarouseloptions={{axis: matches ? 'y' : 'x'}}
          mainCarouseloptions={{}}
        />

        <ProductDetailsSection isFavorited={product.isFavorited} />
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
  unitOfMeasurement: string;
  isInStock: boolean;
};
const ProductDetailsSection = ({isFavorited}: {isFavorited: boolean}) => {
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
      <div className="right-side-info flex flex-col gap-6 max-w-[588px] py-8">
        <div className="top flex flex-col gap-6">
          <div className="">
            <div className="flex justify-between">
              <figure>
                <img src="Logo.png" alt="" />
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
              <h3>
                ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
                CIGWELD Edition
              </h3>
              <div className="flex justify-between flex-col xl:flex-row items-baseline">
                <div className="flex gap-5">
                  <div className="flex text-base items-center gap-1">
                    <p className=" font-semibold leading-6">sku: </p>
                    <p className="text-Grey-500 font-normal">1-1601-EC</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold leading-6 text-grey-600">
                      Unit Of Measurement:
                    </p>
                    <p className="text-Grey-500 font-normal">1 Box</p>
                    <Button
                      className="uppercase bg-primary-200 text-primary-500 font-medium leading-4 text-[14px] not-italic hover:text-white"
                      size="default"
                    >
                      Default
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2 bg-semantic-success-100 items-center p-2">
                  <InStock />
                  <p className="uppercase text-[14px] font-medium text-semantic-success-500">
                    IN STOCK
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col gap-2">
              <div className="flex gap-8 ">
                <ProductCardInfo
                  sku={''}
                  productName={''}
                  buyPrice={649.22}
                  rppPrice={799.87}
                />

                <ProductInfoTable />
              </div>
              <div className="py-2 px-4 bg-semantic-info-100 flex gap-2 border-semantic-info-500 border-l-4 border-y-0 border-r-0 mb-2">
                <CircleInformationMajor />
                <p className="text-base font-normal leading-[21px]">
                  Price will change if you increase quantity of items.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
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
              <SelectACountryDropdown
                placeHolder="Country"
                items={['Nepal', 'UK', 'Australia']}
              />
              <Button className="uppercase flex-grow" variant="primary">
                Add to cart
              </Button>
            </div>
          </div>
        </div>
        <div className="flex max-w-[483px] gap-2">
          <PickupLocation />
          <div>
            <p>
              Pickup available at <span>SUPERCHEAP AUTO NZ PTY LTD</span>
            </p>
            <p>Usually ready in 4 hours</p>
            <WarehouseInformation
              pickupTitle={'Pick Availability'}
              productImageUrl={'weld-helment.png'}
              productName={
                'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition'
              }
              placeitle={''}
              pickupTime={''}
              customerName={''}
              street={''}
              city={''}
              location={0}
              coordinates={0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

type ProductCardInfoProps = {
  sku: string;
  productName: string;
  buyPrice: number;
  rppPrice: number;
};
function ProductCardInfo({
  sku,
  productName,
  buyPrice,
  rppPrice,
}: ProductCardInfoProps) {
  return (
    <>
      <div className="p-4 flex flex-col gap-6">
        <div className="tag flex flex-col gap-[11px]">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                  BUY PRICE
                </p>
              </div>
              <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
                ${buyPrice}
              </h3>
              <p className="text-[14px] font-normal leading-4">(Excl. GST)</p>
            </div>
            <div className="flex flex-col border-grey-50 border-l-2 border-y-0 border-r-0 pl-6">
              <div className="flex items-center ">
                <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                  rrp
                </p>
              </div>
              <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
                ${rppPrice}
              </h3>
              <p className="text-[14px] font-normal leading-4">(inc. GST)</p>
            </div>
          </div>
        </div>
        <p className="text-lg font-normal leading-[22px]">
          Minimum Order (500 pieces)
        </p>
      </div>
    </>
  );
}

export function SelectACountryDropdown({
  placeHolder,
  items,
}: {
  placeHolder: string;
  items: Array<string>;
}) {
  return (
    <div className="flex flex-col">
      <h3 className="text-base font-normal not-italic text-grey-800">
        Country
      </h3>
      <Select>
        <SelectTrigger className="w-[120px] h-full text-base font-normal leading-[21px] not-italic">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
        <SelectContent className="product-names">
          <SelectGroup>
            {items?.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
