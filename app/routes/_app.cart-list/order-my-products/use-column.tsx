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
          const warehouse = info.row.original.warehouse;
          return (
            <ItemsColumn
              title={product.title}
              sku={product.sku}
              featuredImage={product.featuredImage}
              moq={product.moq || 1}
              handle={product?.handle}
              inventory={product.inventory}
              warehouse={warehouse}
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
              quantity={product.quantity}
              info={info}
              productId={product.productId}
              variantId={product.variantId}
              moq={product.moq || 1}
              lineItemId={product.id}
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
              uom={product.uom}
              unitOfMeasure={product.unitOfMeasure}
              info={info}
              selectedUOMName={product.uomName}
              productId={product.productId}
              setUpdateCart={setUpdateCart}
            />
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.companyPrice;
          const priceRange = info.row.original.priceRange;
          const quantity = info.row.original.quantity;
          const product = info.row.original;
          const UOM = info.row.original.uom;
          const currencySymbol = info.row.original.currencySymbol;
          const discountStatus =
            info.row.original.type3DiscountPriceAppliedStatus;
          return (
            <ProductTotal
              totalPrice={productTotal}
              quantity={quantity}
              UOM={UOM}
              unitOfMeasure={product.unitOfMeasure}
              defaultUOM={product.defaultUOM}
              priceRange={priceRange}
              currencySymbol={currencySymbol}
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
              currency={info.row.original.currency || '$'}
              discount={product?.discountMessage}
              discountStatus={discountStatus}
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
  'title' | 'sku' | 'featuredImage' | 'moq' | 'warehouse'
> & {handle?: string; inventory: StockStatus};

export function ItemsColumn({
  title,
  sku,
  featuredImage,
  moq,
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
          <p className="!p-0 !m-0 font-normal leading-4 text-[14px] text-grey-800 capitalize ">
            minimum order({moq})
          </p>
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
    if (isNaN(quantity + 1)) {
      updateQuantity(moq);
      return;
    }
    updateQuantity(quantity + 1);
  };
  const handleDecreaseQuantity = () => {
    if (isNaN(quantity + 1)) {
      updateQuantity(moq);
      return;
    }
    updateQuantity(quantity - 1);
  };
  const handleInputChange = (event: any) => {
    const inputQuantity = parseInt(event.target.value);
    updateQuantity(inputQuantity);
  };

  return (
    <>
      <p className="text-sm leading-none text-red-500">
        {quantity < moq && quantity >= 1 && (
          <>
            Orders below MOQ ({moq}) will incur
            <br /> additional surcharges
          </>
        )}
        {(quantity < 1 || isNaN(quantity)) && (
          <>
            Minimum order quantity
            <br /> should be greater than 0
          </>
        )}
        {quantity > CART_QUANTITY_MAX && (
          <>
            Maximum order quantity
            <br /> is {CART_QUANTITY_MAX}
          </>
        )}
      </p>
      <div
        className={`flex flex-col gap-[11.5px] cart__list--quantity ${
          (quantity < moq && quantity >= 1) ||
          quantity < 1 ||
          isNaN(quantity) ||
          quantity > CART_QUANTITY_MAX
            ? 'mt-1.5'
            : 'mt-[2.2rem]'
        }`}
      >
        <div className="flex items-center">
          <button
            className={`flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10 ${
              quantity - 1 < 1 && 'cursor-not-allowed'
            }`}
            type="button"
            onClick={handleDecreaseQuantity}
            disabled={quantity - 1 < 1}
          >
            -
          </button>
          <input
            type="number"
            className="flex items-center justify-center w-20 text-center border-solid appearance-none border-x-0 border-grey-200 min-h-10"
            value={quantity}
            name="quantity"
            onChange={handleInputChange}
            min={1}
            max={CART_QUANTITY_MAX}
            data-cy="product-quantity"
            required
          />
          <button
            className="flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10"
            type="button"
            onClick={handleIncreaseQuantity}
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
  totalPrice,
  isBulkDetailVisible,
  setIsBulkDetailsVisible,
  isRowChecked,
  priceRange,
  quantity,
  unitOfMeasure,
  defaultUOM,
  UOM,
  currency,
  discount,
  currencySymbol,
  discountStatus,
}: {
  totalPrice: string;
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
  unitOfMeasure: any;
  defaultUOM: any;
  quantity: number;
  UOM: any;
  currency: string;
  discount?: string;
  currencySymbol: string;
  discountStatus: boolean;
}) {
  const prices = getProductPriceByQty({
    qty: quantity,
    uomList: unitOfMeasure,
    selectedUOM: UOM,
    defaultUom: defaultUOM,
    priceRange,
    companyDefaultPrice: totalPrice,
    discountStatus,
  });

  return (
    <div className="flex flex-col gap-4 items-baseline min-w-[110px]">
      <div className="flex flex-col gap-1">
        <div className="">
          <div className="flex mb-1.5 text-semantic-success-500 font-medium text-sm uppercase">
            BUY PRICE
            <div className="info-block">
              <div className="flex items-center justify-center w-5 h-5 text-xs">
                <div
                  className="cursor-pointer price-tooltip"
                  data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                >
                  <span>
                    <TooltipInfo />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-grey-900 text-lg leading-5.5 italic">
          {currency}
          &nbsp;{currencySymbol}
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
            } uppercase text-xs py-1 px-2.5 font-semibold`}
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
