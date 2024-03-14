
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
  veriantId: string;
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

export function useMyProductColumn() {
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
          const meta = info.table.options.meta;
          console.log("meta", meta)
          return <QuantityColumn quantity={product.quantity} unitOfMeasure={product.unitOfMeasure} defaultUOM={product.defaultUOM} priceRange={product.priceRange} totalPrice={product.totalPrice} />;
        },
      },
      {
        accessorKey: 'UOM',
        header: 'UOM',
        enableSorting: false,
        cell: (info) => {
          const productMeasurement = info.row.original.uom;
          const uomList = info.row.original.unitOfMeasure;
          return (
            <ProductMeasurement
              uom={productMeasurement}
              unitOfMeasure={uomList}
            />
          );
        },
      },
      {
        accessorKey: 'total',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.totalPrice;
          const priceRange = info.row.original.priceRange;
          return (
            <ProductTotal
              totalPrice={productTotal}
              priceRange={priceRange}
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
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
type ItemsColumnType = Pick<BulkOrderColumn, 'title' | 'sku' | 'featuredImage'>;

function ItemsColumn({ title, sku, featuredImage }: ItemsColumnType) {
  return (
    <div className="flex space-x-2">
      <figure className="bg-grey-25 p-3 !w-20 ">
        <img
          src={featuredImage ?? DEFAULT_IMAGE.IMAGE}
          alt="featured"
          className="object-contain object-center h-full"
        />
      </figure>
      <figcaption className="flex flex-col justify-between">
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
          <p className="!p-0 !m-0 font-normal leading-4 text-[14px] text-grey-800 capitalize ">
            minimum order(500 pieces)
          </p>
        </div>
      </figcaption>
    </div>
  );
}
/**
 * @description Quantity Column Component
 */
type QuantityColumnType = Pick<BulkOrderColumn, 'quantity' | 'unitOfMeasure' | 'defaultUOM' | 'priceRange' | 'totalPrice'>;
function QuantityColumn({ quantity, unitOfMeasure, defaultUOM, priceRange, totalPrice }: QuantityColumnType) {
  const [quantityCounter, setQuantityCounter] = useState(quantity);
  const [productPrice, setProductPrice] = useState(totalPrice);
  const [UOM, setUOM] = useState(defaultUOM);

  const handleIncreaseQuantity = () => {
    const prices = getProductPriceByQty(
      quantityCounter + 1,
      unitOfMeasure,
      UOM,
      defaultUOM,
      priceRange,
      totalPrice,
    );
    setProductPrice(prices);
    setQuantityCounter(quantityCounter + 1);
  }

  const handleDecreaseQuantity = () => {
    const prices: any = getProductPriceByQty(
      quantityCounter > 1 ? quantityCounter - 1 : 1,
      unitOfMeasure,
      UOM,
      defaultUOM,
      priceRange,
      totalPrice,
    );
    setProductPrice(prices);
    setQuantityCounter(quantityCounter > 0 ? quantityCounter - 1 : 0);
  };

  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    const prices = getProductPriceByQty(
      isNaN(inputQuantity) ? 0 : inputQuantity,
      unitOfMeasure,
      UOM,
      defaultUOM,
      priceRange,
      totalPrice,
    );
    setProductPrice(prices);
    setQuantityCounter(isNaN(inputQuantity) ? 0 : inputQuantity);
  }

  return (
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
          value={quantityCounter}
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
          Minimum Order Quantity {productPrice}
        </p>
      </div>
    </div>
  );
}
/**
 * @description Measurement Column Component
 */
type MeasurementColumnType = Pick<BulkOrderColumn, 'uom' | 'unitOfMeasure'>;

function ProductMeasurement({ uom, unitOfMeasure }: MeasurementColumnType) {
  return (
    <>
      {unitOfMeasure.length > 0 ? (
        <select
          name="filter_by"
          className="w-full min-w-[92px] place-order h-full border-grey-100"
          defaultValue={uom}
        >
          {unitOfMeasure?.map((uom: any, index: number) => (
            <option value={uom.unit} key={index + 'uom'}>
              {uom.unit}
            </option>
          ))}
        </select>
      ) : (
        <p>{uom}</p>
      )}
    </>
  );
}
/**
 * @description Total Column Component
 */
function ProductTotal({
  totalPrice,
  isBulkDetailVisible,
  setIsBulkDetailsVisible,
  isRowChecked,
  priceRange,
}: {
  totalPrice: number;
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
}) {
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
          ${(totalPrice && totalPrice) || 'N/A'}
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
