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
import {Button} from '~/components/ui/button';
import {Checkbox} from '~/components/ui/checkbox';

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
import {WishListItem, WishListProductType} from './route';
import RemoveDialogbox from './sections/remove-dialogbox';

export const columns: ColumnDef<WishListItem>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          // || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'product',
    cell: ({row}) => (
      <WishListProductItem
        productImageUrl={
          (row.getValue('product') as WishListProductType).productImageUrl
        }
        sku={(row.getValue('product') as WishListProductType).sku}
        productName={
          (row.getValue('product') as WishListProductType).productName
        }
        inStock={(row.getValue('product') as WishListProductType).inStock}
      />
    ),
    header: 'Items',
  },
  {
    accessorKey: 'buyPrice',
    header: 'Price',
    cell: ({row}) => <WishlistPriceItem buyPrice={row.getValue('buyPrice')} />,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({row}) => <WishlistQuantity count={row.getValue('quantity')} />,
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({row}) => (
      <Button className="uppercase flex-grow" variant="primary">
        Add to cart
      </Button>
    ),
  },
];

export function WishListTable({
  title,
  data,
}: {
  title: string;
  data: WishListItem[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  function handleAddAllToCart() {
    table.toggleAllPageRowsSelected(true);
  }

  function handleRemoveAllItems() {
    table.toggleAllPageRowsSelected(false);
  }

  return (
    <article className="container bg-grey-25 py-6">
      <section className="flex justify-between">
        <h3>{title}</h3>
        {/* Only show this div if there are selected rows */}
        {table.getSelectedRowModel().rows.length ? (
          <div className="flex flex-row gap-2 items-center">
            {/* Get the number of selected rows */}
            <p className="italic font-bold leading-[22px] text-lg">
              {table.getSelectedRowModel().rows.length === 1
                ? '1 item selected'
                : `${table.getSelectedRowModel().rows.length} items selected`}
            </p>
            {/* Toggle select all rows */}
            <Button
              onClick={handleAddAllToCart}
              className="uppercase flex-grow"
              variant="primary"
            >
              Add All to cart
            </Button>
            <div className="remove-dialogue">
              <RemoveDialogbox handleRemoveAllItems={handleRemoveAllItems} />
            </div>
          </div>
        ) : undefined}
      </section>

      {/* Table Begins Here */}
      <div className="rounded-md border bg-white mt-6  wishlist">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-lg font-medium leading-[22px] text-grey-900"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </article>
  );
}
