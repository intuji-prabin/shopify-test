import { Link } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { TooltipInfo } from '~/components/icons/orderStatus';
import { badgeVariants } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { IndeterminateCheckbox } from '~/components/ui/intermediate-checkbox';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { getProductPriceByQty } from '~/routes/_app.product_.$productSlug/product-detail';

export type BulkOrderColumn = {
  productId: string;
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
};

export function useMyProductColumn(currency?: string) {
  const columns = useMemo<ColumnDef<BulkOrderColumn>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
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
              title={product.title}
              sku={product.sku}
              featuredImage={product.featuredImage}
              moq={product.moq}
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
              moq={product.moq}
              lineItemId={product.id}
            />
          );
        },
      },
      {
        accessorKey: 'uom',
        header: 'Unit Of Measurement',
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
          return (
            <ProductTotal
              totalPrice={productTotal}
              quantity={quantity}
              UOM={UOM}
              unitOfMeasure={product.unitOfMeasure}
              defaultUOM={product.defaultUOM}
              priceRange={priceRange}
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
              currency={currency || '$'}
            />
          );
        },
      },
    ],
    [],
  );

  return { columns };
}

/**
 * @description Items Column Component
 */
type ItemsColumnType = Pick<
  BulkOrderColumn,
  'title' | 'sku' | 'featuredImage' | 'moq'
>;

export function ItemsColumn({ title, sku, featuredImage, moq }: ItemsColumnType) {
  return (
    <div className="flex space-x-2">
      <figure className="bg-grey-25 p-3 !w-20 ">
        <img
          src={featuredImage ?? DEFAULT_IMAGE.IMAGE}
          alt="featured"
          className="object-contain object-center h-full"
        />
      </figure>
      <figcaption className="flex flex-col gap-y-1">
        <h5 className="">{(title && title) || '--'}</h5>
        <div className="flex space-x-5 items-center max-w-[180px] flex-wrap gap-2">
          <p className="mr-2">
            <span className="font-semibold text-grey-900 ">SKU: </span>
            {(sku && sku) || 'N/A'}
          </p>
          <div className={`${badgeVariants({ variant: 'inStock' })} !m-0 `}>
            <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>IN
            STOCK
          </div>
        </div>
        <p className="!p-0 !m-0 font-normal leading-4 text-[14px] text-grey-800 capitalize ">
          minimum order({moq})
        </p>
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
> & { info: any; lineItemId?: string };
export function QuantityColumn({
  quantity,
  info,
  productId,
  variantId,
  moq,
  lineItemId,
}: QuantityColumnType) {
  const meta = info.table.options.meta;

  const handleIncreaseQuantity = () => {
    meta?.updateData(info.row.index, info.column.id, quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    meta?.updateData(
      info.row.index,
      info.column.id,
      quantity > 0 ? quantity - 1 : 0,
    );
  };

  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    meta?.updateData(
      info.row.index,
      info.column.id,
      isNaN(inputQuantity) ? 0 : inputQuantity,
    );
  }

  return (
    <>
      <div className="flex flex-col gap-[11.5px] mt-[2.4rem] cart-list">
        <div className="flex items-center">
          <button
            className="flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <input
            type="text"
            className="flex items-center justify-center w-10 text-center border-solid border-x-0 border-grey-200 min-h-10"
            min="1"
            value={quantity}
            name="quantity"
            onChange={handleInputChange}
          />
          <button
            className="flex items-center justify-center w-10 border border-solid border-grey-200 min-h-10"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
        <div className="flex items-center gap-1">
          <div className="info-block">
            <p className="flex items-center justify-center h-5 min-w-5 ">
              <Link
                to=""
                data-tooltip="The minimum order quantity is 500. Orders below this quantity will incur additional surcharges."
              >
                <span>
                  <TooltipInfo fillColor="#0092CF" />
                </span>
              </Link>
            </p>
          </div>
          <p className="text-grey-700 text-[14px] font-normal capitalize  leading-[16px]">
            Minimum Order Quantity {moq}
          </p>
        </div>
      </div>
      <input type="hidden" name={`${productId}_productId`} value={productId} />
      <input
        type="hidden"
        name={`${productId}_productVariant`}
        value={variantId}
      />
      <input
        type="hidden"
        name={`${productId}_lineItemId`}
        value={lineItemId}
      />
      <input type="hidden" name={`${productId}_quantity`} value={quantity} />
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
};

export function ProductMeasurement({
  uom,
  unitOfMeasure,
  info,
  selectedUOMName,
  productId,
}: MeasurementColumnType) {
  const [UOM, setUom] = useState(uom);
  const meta = info.table.options.meta;

  const handleUOMChange = (selectedUOM: string) => {
    setUom(selectedUOM);
    meta?.updateData(info.row.index, info.column.id, selectedUOM);
  };

  return (
    <>
      <select
        name="uomSelector"
        className="w-full min-w-[92px] place-order h-full border-grey-100"
        onChange={(e: any) => handleUOMChange(e.target.value)}
        defaultValue={UOM}
      >
        {unitOfMeasure.length > 0 ? (
          unitOfMeasure?.map((uom: any, index: number) => (
            <option value={uom.code} key={index + 'uom'}>
              {uom.unit}
            </option>
          ))
        ) : (
          <option value={UOM}>{selectedUOMName}</option>
        )}
      </select>
      <input type="hidden" name={`${productId}_uom`} value={UOM} />
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
}) {
  const prices = getProductPriceByQty(
    quantity,
    unitOfMeasure,
    UOM,
    defaultUOM,
    priceRange,
    totalPrice,
  );

  return (
    <div className="flex flex-col gap-4 items-baseline min-w-[110px]">
      <div className="flex flex-col gap-1">
        <div className="">
          <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm uppercase">
            BUY PRICE
            <div className="info-block">
              <p className="flex items-center justify-center w-5 h-5 text-xs">
                <div
                  className="cursor-pointer price-tooltip"
                  data-tooltip="Recommended retail price"
                >
                  <span>
                    <TooltipInfo />
                  </span>
                </div>
              </p>
            </div>
          </p>
        </div>
        <p className="text-grey-900 text-lg leading-5.5 italic">
          {currency}
          &nbsp;{prices?.toFixed(2) || 'N/A'}
        </p>
        <p className="text-sm italic font-bold leading-normal text-grey-500">
          (Excl. GST)
        </p>
      </div>
      {priceRange.length > 0 && (
        <Button
          onClick={setIsBulkDetailsVisible}
          className={`${isRowChecked ? 'bg-white' : 'bg-primary-200'
            }text-[14px] italic font-bold leading-6 uppercase p-0 bg-white text-grey-900 underline hover:bg-white decoration-primary-500 underline-offset-4`}
        >
          {isBulkDetailVisible ? 'Hide' : 'View'} BULK PRICE
        </Button>
      )}
    </div>
  );
}
