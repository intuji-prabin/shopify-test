import {HTMLProps, useEffect, useMemo, useRef, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {InfoIcon} from '~/components/icons/info-icon';
import {badgeVariants} from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {TooltipInfo} from '~/components/icons/orderStatus';
import {Link} from '@remix-run/react';

export type BulkOrderColumn = {
  id: string;
  items: {
    name: string;
    image: string;
    isStock: boolean;
    sku: string;
  };
  quantity: number;
  total: string;
  measurement: string;
};

export function useColumn() {
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
          return <ItemsColumn items={product.items} />;
        },
      },

      {
        accessorKey: 'quantity',
        header: 'Quantity',
        enableSorting: false,
        cell: (info) => {
          const productQuantity = info.row.original.quantity;
          return <QuantityColumn quantity={productQuantity} />;
        },
      },
      {
        accessorKey: 'measurement',
        header: 'Measurement',
        enableSorting: false,
        cell: (info) => {
          const productMeasurement = info.row.original.measurement;
          return <ProductMeasurement measurement={productMeasurement} />;
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.total;
          return <ProductTotal total={productTotal} />;
        },
      },
    ],
    [],
  );
  return {columns};
}

/**
 * @description Select Column Component
 */
function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: {indeterminate?: boolean} & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer'}
      {...rest}
    />
  );
}

/**
 * @description Items Column Component
 */
type ItemsColumnType = Pick<BulkOrderColumn, 'items'>;

function ItemsColumn({items}: ItemsColumnType) {
  const {name, image, sku} = items;
  return (
    <div className="flex space-x-2">
      <figure className="bg-grey-25 p-3 w-20">
        <img
          src={image}
          alt="item-image"
          className="object-contain object-center h-full"
        />
      </figure>
      <figcaption className="flex flex-col justify-between">
        <h5 className="">{name}</h5>
        <div className="flex space-x-5 items-center max-w-[180px] flex-wrap">
          <p className="mr-2">
            <span className="text-grey-900 font-semibold ">SKU: </span>
            {sku}
          </p>
          <div className={`${badgeVariants({variant: 'inStock'})} !m-0 `}>
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
type QuantityColumnType = Pick<BulkOrderColumn, 'quantity'>;
function QuantityColumn({quantity}: QuantityColumnType) {
  const [quantityCounter, setQuantityCounter] = useState(quantity);

  const handleIncreaseQuantity = () =>
    setQuantityCounter((previousState) => previousState + 1);

  const handleDecreaseQuantity = () =>
    setQuantityCounter((previousState) => previousState - 1);
  return (
    <div className="flex flex-col gap-[11.5px] mt-[2.5rem]">
      <div className="flex items-center">
        <button
          className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
          onClick={handleDecreaseQuantity}
        >
          -
        </button>
        <p className="border-y border-solid border-grey-200 flex items-center justify-center min-h-10 w-10">
          {quantityCounter}
        </p>
        <button
          className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
          onClick={handleIncreaseQuantity}
        >
          +
        </button>
      </div>
      <div className="flex items-center gap-1">
        <div className="info-block">
          <p className="h-5 w-5 flex justify-center items-center ">
            <Link to="" data-tooltip="Recommended retail price">
              <span>
                <TooltipInfo fillColor="#0092CF" />
              </span>
            </Link>
          </p>
        </div>
        <p className="text-grey-700 text-[14px] font-normal capitalize  leading-[16px]">
          Minimum Order Quantity
        </p>
      </div>
    </div>
  );
}

/**
 * @description Measurement Column Component
 */
type MeasurementColumnType = Pick<BulkOrderColumn, 'measurement'>;
function ProductMeasurement({measurement}: MeasurementColumnType) {
  return (
    <Select>
      <SelectTrigger className="w-[116px] place-order rounded-sm ">
        <SelectValue placeholder="boxes" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="banana">Pieces</SelectItem>
          <SelectItem value="apple">Boxes</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

/**
 * @description Total Column Component
 */
type TotalColumnType = Pick<BulkOrderColumn, 'total'>;

function ProductTotal({total}: TotalColumnType) {
  return (
    <div className="flex flex-col gap-4 items-baseline">
      <div className="flex flex-col gap-1">
        <div className="">
          <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm">
            BUY PRICE{' '}
            <span>
              <InfoIcon />
            </span>
          </p>
        </div>

        <p className="text-grey-900 text-lg leading-5.5 italic">${total}</p>
        <p className="text-grey-500 font-bold italic text-sm leading-normal">
          (Excl. GST)
        </p>
      </div>
      <Link
        to=""
        className="text-[14px] italic font-bold leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]"
      >
        VIEW BULK PRICE
      </Link>
    </div>
  );
}
