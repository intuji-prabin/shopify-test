import {HTMLProps, useEffect, useMemo, useRef, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {InfoIcon} from '~/components/icons/info-icon';
import {badgeVariants} from '~/components/ui/badge';

export type BulkOrderColumn = {
  id: string;
  items: {
    name: string;
    image: string;
    isStock: boolean;
    sku: string;
  };
  price: string;
  quantity: number;
  total: string;
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
        accessorKey: 'price',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productPrice = info.row.original.price;
          return <PriceColumn price={productPrice} />;
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
        accessorKey: 'total',
        header: 'Total',
        enableSorting: false,
        cell: (info) => info.getValue(),
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
    <figure className="flex space-x-2">
      <div className="bg-grey-25 p-3 w-20 h-20">
        <img src={image} alt="item-image" />
      </div>
      <figcaption className="flex flex-col justify-between">
        <h5 className="">{name}</h5>
        <div className="flex space-x-5 items-center">
          <p>
            <span className="text-grey-900 font-semibold ">SKU: </span>
            {sku}
          </p>
          <div className={badgeVariants({variant: 'inStock'})}>
            <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>IN
            STOCK
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

/**
 * @description Price Column Component
 */
type PriceColumnType = Pick<BulkOrderColumn, 'price'>;

function PriceColumn({price}: PriceColumnType) {
  return (
    <div>
      <div className="">
        <p className="flex mb-1.5 text-semantic-success-500 font-medium text-sm">
          BUY PRICE{' '}
          <span>
            <InfoIcon />
          </span>
        </p>
      </div>
      <p className="text-grey-900 text-lg leading-5.5 italic">${price}</p>
      <p className="text-grey-500 font-bold italic text-sm leading-normal">
        (Excl. GST)
      </p>
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
    <div className="flex items-center">
      <button
        className="border border-solid border-grey-200 py-3 px-5"
        onClick={handleDecreaseQuantity}
      >
        -
      </button>
      <p className="border-y border-solid border-grey-200 p-3 w-12 ">
        {quantityCounter}
      </p>
      <button
        className="border border-solid border-grey-200 py-3 px-5"
        onClick={handleIncreaseQuantity}
      >
        +
      </button>
    </div>
  );
}
