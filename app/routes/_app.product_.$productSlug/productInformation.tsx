import {Form, Link, useSubmit} from '@remix-run/react';
import {useState} from 'react';
import Info from '~/components/icons/info';
import {
  CircleInformationMajor,
  Compare,
  ProductLoveRed,
  ProductLoveWhite,
} from '~/components/icons/orderStatus';
import {badgeVariants} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';
import {Price} from '~/components/ui/price';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {useMediaQuery} from '../../hooks/useMediaQuery';
import CarouselThumb from './carouselThumb';
import {getProductPriceByQty} from './product-detail';
import {ProductInfoTable} from './productInfoTable';
import {Can} from '~/lib/helpers/Can';

export default function ProductInformation({product}: any) {
  const matches = useMediaQuery('(min-width: 1025px)');
  const volumePrice = product?.priceRange?.length > 0 ? true : false;

  return (
    <section className="bg-white">
      <div className="flex flex-col flex-wrap items-start gap-6 px-6 lg:gap-14 lg:flex-row">
        {product?.imageUrl && product?.imageUrl?.length > 0 && (
          <div className="w-full lg:w-[calc(50%_-_28px)] pt-6 pb-8">
            <CarouselThumb
              images={product?.imageUrl}
              thumbNailCarouseloptions={{axis: matches ? 'y' : 'x'}}
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
          isFavorited={product?.liked}
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
          moq={product?.moq || 1}
          uomCode={product?.uomCode}
          currency={product?.currency}
        />
      </div>
    </section>
  );
}

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
  currency,
}: any) => {
  const [quantity, setQuantity] = useState(parseFloat(moq) || 1);
  const [UOM, setUOM] = useState(uomCode);
  const firstPrice = getProductPriceByQty(
    quantity,
    unitOfMeasure,
    UOM,
    uomCode,
    priceRange,
    companyDefaultPrice,
  );
  const [productPrice, setProductPrice] = useState(firstPrice);

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
    if (isNaN(quantity - 1)) {
      setQuantity(parseFloat(moq));
      return;
    }
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
    if (isNaN(quantity + 1)) {
      setQuantity(parseFloat(moq));
      return;
    }
    setQuantity(quantity + 1);
  }
  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    const prices = getProductPriceByQty(
      inputQuantity,
      unitOfMeasure,
      UOM,
      box,
      priceRange,
      companyDefaultPrice,
    );
    setProductPrice(prices);
    setQuantity(inputQuantity);
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
      className={`w-full ${
        productImageLength > 0 && 'lg:w-[calc(50%_-_28px)]'
      } py-8`}
    >
      <div className="flex justify-between">
        <figure>
          <img src="/cigweld-logo.png" alt="" className="max-h-7" />
        </figure>
        <ul className="flex gap-[7px]">
          <li className="w-[36px] h-[36px] flex justify-center items-center border-grey-50 border-[1px]">
            <Link to={`/product-comparison/${productId}`}>
              <Compare />
            </Link>
          </li>
          <li className="w-[36px] h-[36px] flex justify-center items-center  border-grey-50 border-[1px]">
            <Form method={isFavorited ? 'DELETE' : 'POST'} className="flex">
              <input type="hidden" name="productId" value={productId} />
              <button
                value={isFavorited ? 'removeFromWishList' : 'addToWishList'}
                name="action"
              >
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
            <p className="font-normal text-Grey-500">{skuUnits || 'N/A'}</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold leading-6 text-grey-600">
              {unitOfMeasurement}
            </p>
            <p className="font-normal text-Grey-500">{box}</p>
            <div className={`${badgeVariants({variant: 'primary'})} !m-0`}>
              {defaultButton}
            </div>
          </div>
        </div>
        <div className={`${badgeVariants({variant: 'inStock'})} !m-0 w-max`}>
          <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>
          IN STOCK
        </div>
      </div>
      <Can I="view" a="view_product_price">
        <div className="flex flex-wrap gap-12 pt-6 product_det__pricing">
          <Price
            currency={currency}
            price={productPrice}
            className="relative"
          />
          <Price
            currency={currency}
            price={originalPrice}
            variant="rrp"
            className="relative"
          />
        </div>
      </Can>
      <p className="text-lg font-normal leading-[22px] pt-6">
        Minimum Order ({moq})
      </p>
      <Can I="view" a="view_product_price">
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
      </Can>
      <div className="flex gap-2 px-4 py-2 mt-6 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
        <CircleInformationMajor />
        <p className="text-base font-normal leading-[21px]">
          Price will change if you increase quantity of items.
        </p>
      </div>
      <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row">
        <div>
          <div className="flex cart__list--quantity">
            <button
              className={`border-[1px] border-grey-500 flex justify-center items-center w-14 aspect-square ${
                quantity - 1 < moq && 'cursor-not-allowed'
              }`}
              onClick={decreaseQuantity}
              disabled={quantity - 1 < moq}
            >
              -
            </button>
            <input
              type="number"
              className="w-20 min-h-14 h-full text-center border-x-0 !border-grey-500"
              value={quantity}
              onChange={handleInputChange}
              min={moq || 1}
              max={CART_QUANTITY_MAX}
              required
            />
            <button
              className="border-[1px] border-grey-500  flex justify-center items-center aspect-square w-14"
              onClick={increaseQuantity}
            >
              +
            </button>
          </div>
          <p className="text-sm text-grey-700 pt-2.5 flex gap-x-1">
            <Info />
            Minimum Order Quantity {moq || 1}
          </p>
        </div>
        <div className="flex flex-col">
          <select
            name="filter_by"
            className="w-full min-w-[120px] min-h-14 place-order h-full !border-grey-500 filter-select"
            onChange={(e: any) => handleUOM(e.target.value)}
            value={UOM}
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
          {quantity < moq ||
          quantity < 1 ||
          quantity > CART_QUANTITY_MAX ||
          isNaN(quantity) ? (
            <>
              <Can I="view" a="add_to_cart">
                <button
                  className="flex items-center justify-center w-full gap-2 p-2 px-6 py-2 text-sm italic font-bold leading-6 uppercase duration-150 border border-solid cursor-not-allowed text-grey-400 bg-grey-200 min-h-14"
                  disabled
                >
                  {addToCart}
                </button>
              </Can>
              <p className="text-red-500">
                Minimum order quantity is {moq || 1} and maximum quantity is{' '}
                {CART_QUANTITY_MAX}
              </p>
            </>
          ) : (
            <Can I="view" a="add_to_cart">

            <Button
              className="flex-grow w-full uppercase min-h-14"
              variant="primary"
              type="submit"
              value="addToCart"
              name="action"
            >
              {addToCart}
            </Button>
            </Can>

          )}
        </Form>
      </div>
    </div>
  );
};
