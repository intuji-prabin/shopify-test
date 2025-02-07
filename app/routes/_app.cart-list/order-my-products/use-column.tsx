import {Link} from '@remix-run/react';
import {ColumnDef} from '@tanstack/react-table';
import {useEffect, useMemo, useState} from 'react';
import {TooltipInfo} from '~/components/icons/orderStatus';
import {Button} from '~/components/ui/button';
import {IndeterminateCheckbox} from '~/components/ui/intermediate-checkbox';
import {StockStatusChip} from '~/components/ui/stock-status-chip';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {Can} from '~/lib/helpers/Can';
import {getProductPriceByQty} from '~/routes/_app.product_.$productSlug/product-detail';
import {validateDiscountPrice} from '../validateDiscountPrice';
import {validDecrementQty, validIncrementQty} from '~/components/ui/validQty';
import {InputQuantityError} from '~/components/ui/inputQuantity';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type BulkOrderColumn = {
  productId: string;
  inventory: StockStatus;
  variantId: string;
  quantity: number;
  title: string;
  featuredImage: string;
  sku: string;
  uom: string;
  defaultPrice: string;
  compareAtPrice: string;
  companyPrice: string;
  currency: string;
  defaultUOM: string;
  id: string;
  moq: number;
  uomName: string;
  handle: string;
  placeId: number;
  currencySymbol: string;
  warehouse: string;
  type3DiscountPriceAppliedStatus: boolean;
  type2DiscountPriceAppliedStatus: boolean;
  unitPrice: number;
  discountPrice: number;
  unitOfMeasure: [
    {
      unit: string;
      conversion_factor: number;
    },
  ];
  priceRange: [
    {
      minQty: number;
      maxQty: number;
      price: string;
    },
  ];
  totalPrice: number;
  discountMessage: string;
  unitTotalPrice: number;
};

export function useMyProductColumn({
  setUpdateCart,
}: {
  setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const columns = useMemo<ColumnDef<BulkOrderColumn>[]>(
    () => [
      {
        id: 'select',
        header: ({table}) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({row}) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: 'items',
        header: 'Items',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <ItemsColumn
              title={product?.title}
              sku={product?.sku}
              featuredImage={product?.featuredImage}
              handle={product?.handle}
              inventory={product?.inventory}
              warehouse={product?.warehouse}
            />
          );
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <QuantityColumn
              quantity={product?.quantity}
              info={info}
              productId={product?.productId}
              variantId={product?.variantId}
              moq={product?.moq || 1}
              lineItemId={product?.id}
              setUpdateCart={setUpdateCart}
            />
          );
        },
      },
      {
        accessorKey: 'uom',
        header: 'UOM',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <ProductMeasurement
              uom={product?.uom}
              unitOfMeasure={product?.unitOfMeasure}
              info={info}
              selectedUOMName={product?.uomName}
              productId={product?.productId}
              setUpdateCart={setUpdateCart}
            />
          );
        },
      },
      {
        accessorKey: 'unitPrice',
        header: 'Unit Price',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          const currencySymbol = product.currencySymbol;
          const quantity = product?.quantity;
          const finalUOM = Number(product?.uom);
          const priceRange = product?.priceRange;
          const uomRange = product?.unitOfMeasure;
          const defaultUom = product?.defaultUOM;
          const currency = product?.currency;
          const companyPrice = product?.companyPrice;
          const unitPrice = product?.unitPrice;
          const discount = product?.discountMessage;
          const discountStatus = product?.type3DiscountPriceAppliedStatus;
          const discountStatusType2 = product?.type2DiscountPriceAppliedStatus;
          const discountPrice = validateDiscountPrice(
            discountStatus,
            discountStatusType2,
            product?.discountPrice,
          );
          const prices = getProductPriceByQty({
            qty: quantity,
            uomList: uomRange,
            selectedUOM: finalUOM,
            defaultUom: defaultUom,
            priceRange,
            companyDefaultPrice: companyPrice,
            discountStatus,
            discountPrice,
          });
          const priceBeforeDiscount = getProductPriceByQty({
            qty: quantity,
            uomList: uomRange,
            selectedUOM: finalUOM,
            defaultUom: defaultUom,
            priceRange,
            companyDefaultPrice: unitPrice,
          });
          const finalUnitPrice = priceBeforeDiscount / quantity;
          const finalCompanyUsedPrice = prices / quantity;
          return (
            <UnitPrice
              currency={currency}
              currencySymbol={currencySymbol}
              priceRange={priceRange}
              finalUnitPrice={finalUnitPrice}
              unitPrice={unitPrice}
              companyPrice={finalCompanyUsedPrice}
              discount={discount}
              discountStatus={discountStatus || discountStatusType2}
            />
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Total Price',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          const productTotal = product?.companyPrice;
          const priceRange = product?.priceRange;
          const quantity = product?.quantity;
          const UOM = product?.uom;
          const currencySymbol = product?.currencySymbol;
          const discountStatus = product?.type3DiscountPriceAppliedStatus;
          const unitPrice = product?.unitPrice;
          const discountStatusType2 = product?.type2DiscountPriceAppliedStatus;
          const discountPrice = validateDiscountPrice(
            discountStatus,
            discountStatusType2,
            product?.discountPrice,
          );
          const prices = getProductPriceByQty({
            qty: quantity,
            uomList: product.unitOfMeasure,
            selectedUOM: UOM,
            defaultUom: product.defaultUOM,
            priceRange,
            companyDefaultPrice: productTotal,
            discountStatus,
            discountPrice,
          });

          const priceBeforeDiscount = getProductPriceByQty({
            qty: quantity,
            uomList: product.unitOfMeasure,
            selectedUOM: UOM,
            defaultUom: product.defaultUOM,
            priceRange,
            companyDefaultPrice: unitPrice,
          });
          return (
            <ProductTotal
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
              priceRange={priceRange}
              currency={info.row.original.currency || '$'}
              discount={product?.discountMessage}
              currencySymbol={currencySymbol}
              discountStatus={discountStatus || discountStatusType2}
              prices={prices}
              priceBeforeDiscount={priceBeforeDiscount}
            />
          );
        },
      },
    ],
    [],
  );

  return {columns};
}

/**
 * @description Items Column Component
 */
type ItemsColumnType = Pick<
  BulkOrderColumn,
  'title' | 'sku' | 'featuredImage' | 'warehouse'
> & {handle?: string; inventory: StockStatus};

export function ItemsColumn({
  title,
  sku,
  featuredImage,
  handle,
  inventory,
  warehouse,
}: ItemsColumnType) {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <figure className="w-20 p-3 bg-grey-25 max-h-20">
        <Link to={handle ? `/product/${handle}` : '#'}>
          <img
            src={featuredImage ?? DEFAULT_IMAGE.IMAGE}
            alt="featured"
            className="object-contain w-14 h-14"
          />
        </Link>
      </figure>
      <figcaption className="flex flex-col gap-y-1 w-[calc(100%_-_88px)] text-wrap">
        <h5 data-cy="product-name">
          {handle ? (
            <Can
              // key={subMenu.id}
              I="view"
              a="view_product_detail"
              passThrough
            >
              {(allowed) => (
                <>
                  {allowed ? (
                    <Link to={handle ? `/product/${handle}` : '#'}>
                      {(title && title) || '--'}
                    </Link>
                  ) : (
                    <span>{(title && title) || '--'}</span>
                  )}
                </>
              )}
            </Can>
          ) : (
            (title && title) || '--'
          )}
        </h5>
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-grey-900 ">SKU: </span>
            <span data-cy="product-sku">{(sku && sku) || 'N/A'}</span>
          </p>
          <StockStatusChip status={inventory} />
        </div>
        <div>
          {warehouse && inventory === 'In Stock' && (
            <p className="text-[13px] font-medium text-primary-500">
              WAREHOUSE: {warehouse}
            </p>
          )}
        </div>
      </figcaption>
    </div>
  );
}
/**
 * @description Quantity Column Component
 */
type QuantityColumnType = Pick<
  BulkOrderColumn,
  'quantity' | 'productId' | 'variantId' | 'moq'
> & {
  info: any;
  lineItemId?: string;
  setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>;
};
export function QuantityColumn({
  quantity,
  info,
  productId,
  variantId,
  moq,
  lineItemId,
  setUpdateCart,
}: QuantityColumnType) {
  const meta = info.table.options.meta;

  const updateQuantity = (newQuantity: any) => {
    meta?.updateData(info.row.index, info.column.id, Math.max(newQuantity, 1));
    setUpdateCart && setUpdateCart(true);
  };
  const handleIncreaseQuantity = () => {
    const newQuantity = validIncrementQty(moq, quantity);
    updateQuantity(newQuantity);
  };
  const handleDecreaseQuantity = () => {
    const newQuantity = validDecrementQty(moq, quantity);
    updateQuantity(newQuantity);
  };
  const handleInputChange = (event: any) => {
    const inputQuantity = parseInt(event.target.value);
    updateQuantity(inputQuantity);
  };

  return (
    <>
      <InputQuantityError
        quantity={quantity}
        moq={moq}
        className="!pt-0 !font-normal max-w-36 text-sm"
      />
      <div
        className={`flex flex-col gap-[11.5px] cart__list--quantity ${
          quantity < moq ||
          quantity > CART_QUANTITY_MAX ||
          isNaN(quantity) ||
          quantity % moq !== 0
            ? 'mt-1.5'
            : 'mt-[2.2rem]'
        }`}
      >
        <div className="flex items-center">
          <button
            className={`flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10 ${
              quantity - Number(moq) < Number(moq) && 'cursor-not-allowed'
            }`}
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={quantity - Number(moq) < Number(moq)}
          >
            -
          </button>
          <input
            type="number"
            className="flex items-center justify-center w-16 text-center border-solid appearance-none border-x-0 border-grey-200 min-h-10"
            value={quantity}
            name="quantity"
            onChange={handleInputChange}
            min={moq || 1}
            max={CART_QUANTITY_MAX}
            step={moq || 1}
            data-cy="product-quantity"
            required
          />
          <button
            className={`flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10 ${
              quantity + Number(moq) > CART_QUANTITY_MAX
                ? 'cursor-not-allowed'
                : ''
            }`}
            type="button"
            onClick={handleIncreaseQuantity}
            disabled={quantity + Number(moq) > CART_QUANTITY_MAX}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div className="info-block">
            <div className="flex items-center justify-center h-5 min-w-5 ">
              <div
                data-tooltip={`The minimum order quantity is ${moq}. Orders below this quantity will incur additional surcharges.`}
                className="cursor-pointer"
              >
                <span>
                  <TooltipInfo fillColor="#0092CF" />
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm font-normal capitalize  leading-[16px] text-grey-700">
            Minimum Order Quantity <span data-cy="product-moq">{moq}</span>
          </p>
        </div>
      </div>
      <input
        type="hidden"
        name={`${productId + info.row.index}_productId`}
        value={productId}
      />
      <input
        type="hidden"
        name={`${productId + info.row.index}_productVariant`}
        value={variantId}
      />
      <input
        type="hidden"
        name={`${productId + info.row.index}_lineItemId`}
        value={lineItemId}
      />
      <input
        type="hidden"
        name={`${productId + info.row.index}_moq`}
        value={moq}
      />
      <input
        type="hidden"
        name={`${productId + info.row.index}_quantity`}
        value={quantity}
      />
    </>
  );
}
/**
 * @description Measurement Column Component
 */
type MeasurementColumnType = Pick<BulkOrderColumn, 'uom' | 'unitOfMeasure'> & {
  info: any;
  selectedUOMName: any;
  productId?: string;
  setUpdateCart?: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ProductMeasurement({
  uom,
  unitOfMeasure,
  info,
  selectedUOMName,
  productId,
  setUpdateCart,
}: MeasurementColumnType) {
  const [finalUOM, setUom] = useState(uom);
  const meta = info.table.options.meta;

  const handleUOMChange = (selectedUOM: string) => {
    setUpdateCart && setUpdateCart(true);
    setUom(selectedUOM);
    meta?.updateData(info.row.index, info.column.id, selectedUOM);
  };
  useEffect(() => {
    setUom(uom);
  }, [uom]);

  return (
    <>
      <select
        name="uomSelector"
        className="w-full min-w-[92px] place-order h-full border-grey-100"
        onChange={(e: any) => handleUOMChange(e.target.value)}
        value={finalUOM}
      >
        {unitOfMeasure.length > 0 ? (
          unitOfMeasure?.map((uom: any, index: number) => (
            <option value={uom.code} key={index + 'uom'}>
              {uom.unit}
            </option>
          ))
        ) : (
          <option value={finalUOM}>{selectedUOMName}</option>
        )}
      </select>
      <input
        type="hidden"
        name={`${productId + info.row.index}_uom`}
        value={finalUOM}
      />
    </>
  );
}
/**
 * @description Total Column Component
 */
export function ProductTotal({
  isBulkDetailVisible,
  setIsBulkDetailsVisible,
  isRowChecked,
  priceRange,
  currency,
  discount,
  currencySymbol,
  discountStatus,
  prices,
  priceBeforeDiscount,
}: {
  isBulkDetailVisible: boolean;
  isRowChecked: boolean;
  setIsBulkDetailsVisible: () => void;
  priceRange: [
    {
      minQty: number;
      maxQty: number;
      price: string;
    },
  ];
  currency: string;
  discount?: string;
  currencySymbol: string;
  discountStatus?: boolean;
  prices: number;
  priceBeforeDiscount: number;
}) {
  return (
    <div className="flex flex-col gap-4 items-baseline min-w-[110px]">
      <div className="flex flex-col gap-1">
        {discount && discountStatus && (
          <del>
            {currency}
            &nbsp;{currencySymbol}
            {priceBeforeDiscount?.toFixed(2) || '--'}
          </del>
        )}
        <p className="text-grey-900 text-lg leading-5.5 italic">
          {currency}&nbsp;
          {currencySymbol}
          {prices?.toFixed(2) || '--'}
        </p>
        <p className="text-sm italic font-bold leading-normal text-grey-500">
          (Excl. GST)
        </p>
        {discount && (
          <p
            className={`${
              discount === 'Discount Applied'
                ? 'bg-secondary-500'
                : 'bg-red-500 text-white'
            } uppercase text-xs py-1 px-2.5 font-semibold whitespace-nowrap`}
          >
            {discount}
          </p>
        )}
      </div>
      {priceRange.length > 0 && (
        <Button
          onClick={setIsBulkDetailsVisible}
          type="button"
          className={`${
            isRowChecked ? 'bg-white' : 'bg-primary-200'
          }text-[14px] italic font-bold leading-6 uppercase p-0 bg-white text-grey-900 underline hover:bg-white decoration-primary-500 underline-offset-4`}
        >
          {isBulkDetailVisible ? 'Hide' : 'View'} BULK PRICE
        </Button>
      )}
    </div>
  );
}

export function UnitPrice({
  currency,
  currencySymbol,
  priceRange,
  finalUnitPrice,
  unitPrice,
  companyPrice,
  discount,
  discountStatus = false,
}: {
  currency: string;
  currencySymbol: string;
  priceRange: any;
  finalUnitPrice: any;
  unitPrice: any;
  companyPrice: any;
  discount?: string;
  discountStatus?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 items-baseline ${
        discount && priceRange.length > 0 && 'mb-[66px]'
      } ${discount && priceRange.length === 0 && 'mb-[28px]'}`}
    >
      <div className="flex flex-col gap-1">
        {discount && discountStatus && (
          <del>
            {currency}&nbsp;
            {currencySymbol}
            {priceRange.length > 0 ? (
              <>{Number(finalUnitPrice).toFixed(2)}</>
            ) : (
              <>{unitPrice?.toFixed(2) || Number(companyPrice).toFixed(2)}</>
            )}
          </del>
        )}
        <p className="text-grey-900 text-lg leading-5.5 italic">
          {currency}&nbsp;
          {currencySymbol}
          {companyPrice.toFixed(2)}
        </p>
        <p className="text-sm italic font-bold leading-normal text-grey-500">
          (Excl. GST)
        </p>
      </div>
    </div>
  );
}
