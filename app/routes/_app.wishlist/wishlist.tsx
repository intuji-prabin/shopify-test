import { ColumnDef } from '@tanstack/react-table';
import * as React from 'react';
import { Button } from '~/components/ui/button';
import { IndeterminateCheckbox } from '~/components/ui/intermediate-checkbox';
import {
  ItemsColumn,
  ProductMeasurement,
  ProductTotal,
  QuantityColumn,
} from '../_app.cart-list/order-my-products/use-column';

export function useMyWishListColumn() {
  const columns = React.useMemo<ColumnDef<any>[]>(
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
        accessorKey: 'total',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.companyPrice;
          const priceRange = info.row.original.priceRange;
          const quantity = info.row.original.quantity || info.row.original.moq;
          const product = info.row.original;
          const UOM = info.row.original.uom;
          return (
            <ProductTotal
              totalPrice={productTotal}
              quantity={quantity}
              UOM={UOM}
              unitOfMeasure={product.unitOfMeasure}
              defaultUOM={product.uomCode}
              priceRange={priceRange}
              isBulkDetailVisible={info?.row?.getIsExpanded()}
              setIsBulkDetailsVisible={() => info?.row?.toggleExpanded()}
              isRowChecked={info?.row?.getIsSelected()}
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
              quantity={product.quantity || product.moq}
              info={info}
              productId={product.productId}
              veriantId={product.variantId}
              moq={product.moq}
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
              selectedUOMName={product.uom}
            />
          );
        },
      },
      {
        accessorKey: 'action',
        header: 'Action',
        enableSorting: false,
        cell: (info) => {
          const product = info.row.original;
          return (
            <>
              {product.quantity < product.moq ?
                <button
                  className="uppercase flex justify-center items-center text-xs max-h-[unset] lg:max-h-[28px] min-w-[86px] cursor-not-allowed bg-grey-200 text-grey-400 px-6 py-2"
                  disabled
                >
                  Add to cart
                </button> :
                <Button
                  className="uppercase flex-grow max-h-[unset] text-xs lg:max-h-[28px] min-w-[86px]"
                  variant="primary"
                >
                  Add to cart
                </Button>
              }
            </>
          );
        },
      },
    ],
    [],
  );

  return { columns };
}
