import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import WishlistPriceItem from './sections/wishlist-price-item';
import WishlistQuantity from './sections/wishlist-quantity';
import WishListProductItem from './sections/wishlist-product-item';
import { WishListItem, WishListProductType } from './route';
import RemoveDialogbox from './sections/remove-dialogbox';
import { IndeterminateCheckbox } from '~/components/ui/intermediate-checkbox';
import { ItemsColumn, ProductMeasurement, ProductTotal, QuantityColumn } from '../_app.cart-list/order-my-products/use-column';

// export const columns: ColumnDef<WishListItem>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected()
//           // || (table.getIsSomePageRowsSelected() && 'indeterminate')
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: 'product',
//     cell: ({ row }) => (
//       <WishListProductItem
//         // productImageUrl={
//         //   (row.getValue('product') as WishListProductType).productImageUrl
//         // }
//         sku={row?.sku}
//         productName={
//           row?.title
//         }
//       // inStock={(row.getValue('product') as WishListProductType).inStock}
//       />
//     ),
//     header: 'Items',
//   },
//   {
//     accessorKey: 'buyPrice',
//     header: 'Price',
//     cell: ({ row }) => <WishlistPriceItem buyPrice={row.getValue('buyPrice')} />,
//   },
//   {
//     accessorKey: 'quantity',
//     header: 'Quantity',
//     cell: ({ row }) => <WishlistQuantity count={row.getValue('quantity')} />,
//   },
//   {
//     accessorKey: 'action',
//     header: 'Action',
//     cell: ({ row }) => (
//       <Button
//         className="uppercase flex-grow max-h-[unset] lg:max-h-[28px] min-w-[86px]"
//         variant="primary"
//       >
//         Add to cart
//       </Button>
//     ),
//   },
// ];


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
        accessorKey: 'price',
        header: 'Price',
        enableSorting: false,
        cell: (info) => {
          const productTotal = info.row.original.companyPrice;
          const priceRange = info.row.original.priceRange;
          const quantity = info.row.original.moq;
          const product = info.row.original;
          const UOM = info.row.original.uom;
          console.log("UOM", UOM)
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
              quantity={product.moq}
              info={info}
              productId={product.productId}
              veriantId={product.variantId}
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
              uom={product.uomCode}
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
          return (
            <Button
              className="uppercase flex-grow max-h-[unset] lg:max-h-[28px] min-w-[86px]"
              variant="primary"
            >
              Add to cart
            </Button>
          );
        },
      },
    ],
    [],
  );

  return { columns };
}
