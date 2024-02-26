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
import {Button} from '~/components/ui/button';
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
  UDM: string;
};
export function useMyProductColumn() {
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
        accessorKey: 'UDM',
        header: 'UDM',
        enableSorting: false,
        cell: (info) => {
          const productMeasurement = info.row.original.UDM;
          return <ProductMeasurement UDM={productMeasurement} />;
        },
      },
      {
        accessorKey: 'total',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.total;
          return (
            <>
              <ProductTotal
                total={productTotal}
                isBulkDetailVisible={info?.row?.getIsExpanded()}
                setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
                isRowChecked={info?.row?.getIsSelected()}
              />
              {/* {isVisible && <BulkTable quantity={'Quantity'} price={'Price'} />} */}
            </>
          );
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
  const {name, image, isStock, sku} = items;
  return (
    <div className="flex space-x-2">
      <figure className="bg-grey-25 p-3 !w-20 ">
        <img
          src={image}
          alt="item-image"
          className="h-full object-contain object-center"
        />
      </figure>
      <figcaption className="flex flex-col justify-between">
        <h5 className="">{name}</h5>
        <div className="flex space-x-5 items-center max-w-[180px] flex-wrap gap-2">
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
    <div className="flex flex-col gap-[11.5px] mt-[2.4rem] cart-list">
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
          <p className="h-5 min-w-5 flex justify-center items-center ">
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
          Minimum Order Quantity
        </p>
      </div>
    </div>
  );
}
/**
 * @description Measurement Column Component
 */
type MeasurementColumnType = Pick<BulkOrderColumn, 'UDM'>;
function ProductMeasurement({UDM}: MeasurementColumnType) {
  return (
    <Select>
      <SelectTrigger className="min-w-[92px] place-order rounded-sm ">
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
function ProductTotal({
  total,
  isBulkDetailVisible,
  setIsBulkDetailsVisible,
  isRowChecked,
}: {
  total: string;
  isBulkDetailVisible: boolean;
  isRowChecked: boolean;
  setIsBulkDetailsVisible: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 items-baseline min-w-[110px]">
      <div className="flex flex-col gap-1">
        <div className="">
          <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm uppercase">
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
      <Button
        onClick={setIsBulkDetailsVisible}
        className={`${
          isRowChecked ? 'bg-white' : 'bg-primary-200'
        }text-[14px] italic font-bold leading-6 uppercase p-0 bg-white text-grey-900 underline hover:bg-white decoration-primary-500 underline-offset-4`}
      >
        {isBulkDetailVisible ? 'Hide' : 'View'} BULK PRICE
      </Button>
    </div>
  );
}
