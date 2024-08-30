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
import {Separator} from '~/components/ui/separator';
import {StockStatus} from '~/components/ui/stockStatus';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {Can} from '~/lib/helpers/Can';
import {useMediaQuery} from '../../hooks/useMediaQuery';
import CarouselThumb from './carouselThumb';
import {getProductPriceByQty} from './product-detail';
import {ProductInfoTable} from './productInfoTable';
import {InputQuantity, InputQuantityError} from '~/components/ui/inputQuantity';

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
            />
          </div>
        )}

        <ProductDetailsSection
          productName={product?.title}
          isFavorited={product?.liked}
          sku={'SKU'}
          skuUnits={product?.supplierSku}
          unitOfMeasurement={'Unit Of Measurement:'}
          box={product?.uom}
          defaultButton={'Default'}
          addToCart={'Add to cart'}
          unitOfMeasure={product?.unitOfMeasure}
          priceRange={product?.priceRange}
          companyDefaultPrice={product?.companyDefaultPrice}
          originalPrice={product?.originalPrice}
          productId={product?.id}
          productVariantId={product?.variantId}
          productImageLength={product?.imageUrl?.length}
          moq={product?.moq || 1}
          uomCode={product?.uomCode}
          currency={product?.currency}
          currencySymbol={product?.currencySymbol}
          warehouse={product?.warehouse}
          inventory={product?.inventory}
          brandImage={product?.brandImage}
          shortDescription={product?.shortDescription}
          productRank={product?.productRank}
          categories={product?.categories}
          volumePrice={volumePrice}
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
  addToCart,
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
  inventory,
  brandImage,
  shortDescription,
  productRank,
  categories,
  currencySymbol,
  warehouse,
  volumePrice,
}: any) => {
  const [quantity, setQuantity] = useState(parseFloat(moq) || 1);
  const [UOM, setUOM] = useState(uomCode);
  const firstPrice = getProductPriceByQty({
    qty: quantity,
    uomList: unitOfMeasure,
    selectedUOM: UOM,
    defaultUom: uomCode,
    priceRange,
    companyDefaultPrice,
  });
  const [productPrice, setProductPrice] = useState(firstPrice);

  const submit = useSubmit();

  function handleUOM(selectedUOM: any) {
    const prices = getProductPriceByQty({
      qty: quantity,
      uomList: unitOfMeasure,
      selectedUOM,
      defaultUom: box,
      priceRange,
      companyDefaultPrice,
    });
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
          {brandImage && (
            <img
              src={brandImage}
              alt="brand"
              className="object-contain max-h-7"
            />
          )}
        </figure>
        {companyDefaultPrice ? (
          <ul className="flex gap-[7px] info-block">
            <li
              className="w-[36px] h-[36px] flex justify-center items-center border-grey-50 border-[1px]"
              data-tooltip="Compare Product"
            >
              <Link to={`/product-comparison/${productId}`}>
                <Compare />
              </Link>
            </li>
            <Can I="view" a="add_to_wishlist">
              <li
                className="w-[36px] h-[36px] flex justify-center items-center  border-grey-50 border-[1px]"
                data-tooltip="Add To Wishlist"
              >
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
            </Can>
          </ul>
        ) : null}
      </div>
      {categories.length > 0 && (
        <div className="flex mt-2 gap-x-1">
          <p className="text-sm font-semibold">CATEGORIES:</p>
          <ul className="flex flex-wrap">
            {categories?.map(
              (
                categorylist: {
                  title: string;
                  handle: string;
                  categoryId: string;
                },
                index: number,
              ) => {
                return (
                  <li className="text-sm tag-list" key={index + 'tags'}>
                    <Link to={Routes.CATEGORIES} className="text-primary-500">
                      {categorylist?.title}
                    </Link>
                  </li>
                );
              },
            )}
          </ul>
        </div>
      )}
      {volumePrice && (
        <div className="bg-secondary-500 px-2 py-1 text-grey-900 uppercase inline-block mt-2.5 text-base italic font-normal leading-[19px] z-10">
          QTY Buy Available
        </div>
      )}
      <div className="flex gap-x-4 pt-3.5 items-center">
        <h3>{productName}</h3>
        {productRank && (
          <p className="flex items-center justify-center h-8 font-bold rounded-full bg-secondary-500 min-w-8">
            {productRank}
          </p>
        )}
      </div>
      {shortDescription && (
        <p
          className="mt-4"
          dangerouslySetInnerHTML={{__html: shortDescription}}
        ></p>
      )}
      <Separator className="mt-4" />
      <div className="flex flex-col justify-between pt-4 sm:flex-row gap-y-2 gap-x-4">
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
        <div
          className={`py-2 pl-4 pr-3 text-right border border-solid rounded-lg bg-grey-25 border-grey-50 w-max ${
            inventory !== 'In Stock' && 'leading-none'
          }`}
        >
          {warehouse && inventory === 'In Stock' && (
            <p>
              <span className="font-semibold">Warehouse:</span> {warehouse}
            </p>
          )}
          <StockStatus status={inventory} />
        </div>
      </div>
      <Can I="view" a="view_product_price">
        <div className="flex flex-wrap gap-12 pt-6 product_det__pricing">
          <Price
            currency={currency}
            price={productPrice}
            className="relative"
            currencySymbol={currencySymbol}
          />
          <Price
            currency={currency}
            price={
              originalPrice
                ? originalPrice
                : companyDefaultPrice
                ? companyDefaultPrice
                : 0
            }
            variant="rrp"
            className="relative"
            currencySymbol={currencySymbol}
          />
        </div>
      </Can>
      <Can I="view" a="view_product_price">
        {priceRange && priceRange.length > 0 && (
          <>
            <div className="w-full pt-4">
              <ProductInfoTable
                quantity={'Quantity'}
                price={'Price'}
                volumePrice={priceRange}
                className="product_det__table"
                currency={currency}
                currencySymbol={currencySymbol}
              />
            </div>
            <div className="flex gap-2 px-4 py-2 mt-3 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
              <CircleInformationMajor />
              <p className="text-base font-normal leading-[21px]">
                Price will change if you increase quantity of items.
              </p>
            </div>
          </>
        )}
      </Can>
      {companyDefaultPrice ? (
        <div className="flex flex-col items-start gap-4 pt-6 sm:flex-row">
          <div>
            <InputQuantity
              quantity={quantity}
              setQuantity={setQuantity}
              unitOfMeasure={unitOfMeasure}
              UOM={UOM}
              box={box}
              priceRange={priceRange}
              companyDefaultPrice={companyDefaultPrice}
              setProductPrice={setProductPrice}
              moq={moq}
            />
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
            <Can I="view" a="add_to_cart">
              <Button
                className={`flex-grow w-full uppercase min-h-14 ${
                  quantity < moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % moq !== 0
                    ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                    : 'cursor-pointer'
                }`}
                disabled={
                  quantity < moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % moq !== 0
                }
                type={
                  quantity < moq ||
                  quantity > CART_QUANTITY_MAX ||
                  isNaN(quantity) ||
                  quantity % moq !== 0
                    ? 'button'
                    : 'submit'
                }
                name="action"
                value="addToCart"
                variant="primary"
              >
                {addToCart}
              </Button>
              <InputQuantityError quantity={quantity} moq={moq} />
            </Can>
          </Form>
        </div>
      ) : null}
    </div>
  );
};
