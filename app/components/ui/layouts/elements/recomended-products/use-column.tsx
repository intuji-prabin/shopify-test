import {useMemo, useState} from 'react';
import {ColumnDef} from '@tanstack/react-table';
import {Button} from '~/components/ui/button';

export type BulkOrderColumn = {
  id: string;
  items: {
    name: string;
    image: string;
    isStock: boolean;
    sku: string;
    exclGst: string;
  };
  quantity: number;
  total: string;
  UDM: string;
};

export function useMyProductColumn() {
  const columns = useMemo<ColumnDef<BulkOrderColumn>[]>(
    () => [
      {
        accessorKey: 'items',
        header: '',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return <ItemsColumn items={product.items} />;
        },
      },
      {
        accessorKey: 'quantity',
        header: '',
        enableSorting: false,
        cell: (info) => {
          const productQuantity = info.row.original.quantity;
          return <QuantityColumn quantity={productQuantity} />;
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
type ItemsColumnType = Pick<BulkOrderColumn, 'items'>;

function ItemsColumn({items}: ItemsColumnType) {
  const {name, image, isStock, sku, exclGst} = items;
  return (
    <div className="flex space-x-2">
      <figure className="bg-grey-25 p-3 w-20 ">
        <img
          src={image}
          alt="item-image"
          className="object-contain object-center h-full"
        />
      </figure>
      <figcaption className="flex flex-col justify-between">
        <div className="flex space-x-5 items-center max-w-[180px] flex-wrap">
          <p className="mr-2 text-primary-500">
            <span className="font-normal text-sm leading-4 ">SKU: </span>
            {sku}
          </p>
          <h5 className="!ml-0 not-italic text-base font-medium leading-[21px]">
            {name}
          </h5>
          <p className=" italic !ml-0 font-bold text-2xl leading-[29px] text-grey-900 ">
            ${exclGst}
            <span className="text-grey-500 font-bold italic text-sm leading-normal">
              (Excl. GST)
            </span>
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

  function handleAddAllToCart() {
    // table.toggleAllPageRowsSelected(true);
  }
  const handleIncreaseQuantity = () =>
    setQuantityCounter((previousState) => previousState + 1);

  const handleDecreaseQuantity = () =>
    setQuantityCounter((previousState) => previousState - 1);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-[11.5px]">
        <div className="flex items-center">
          <button
            className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
            onClick={handleDecreaseQuantity}
          >
            -
          </button>
          <p className="border border-solid border-grey-200 flex items-center justify-center min-h-10 w-[50px]">
            {quantityCounter}
          </p>
          <button
            className="border border-solid border-grey-200 flex items-center justify-center  min-h-10 w-10"
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
      </div>
      <Button
        onClick={handleAddAllToCart}
        className="uppercase max-w-[129px]"
        variant="primary"
      >
        Add to cart
      </Button>
    </div>
  );
}
