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

const data: WishListItem[] = [
  {
    id: 'm5gr84i9',
    sku: 'W1400190',
    buyPrice: 200,
    quantity: 200,
    action: 'add to cart',
    productImageUrl: 'product.png',
    productName:
      'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
    inStock: false,
  },
  {
    id: 'm5g44i9',
    sku: 'W1400190',
    buyPrice: 200,
    quantity: 200,
    action: 'add to cart',
    productImageUrl: 'product.png',
    productName:
      'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
    inStock: false,
  },
];

type WishListProductType = {
  productImageUrl: string;
  productName: string;
  sku: string;
  inStock: boolean;
};

export type WishListItem = {
  id: string;
  productImageUrl: string;
  productName: string;
  sku: string;
  inStock: boolean;
  // product: WishListProductType;
  buyPrice: number;
  quantity: number;
  action: string;
};

export const columns: ColumnDef<WishListItem>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
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
    // accessorKey: 'product',
    // accessorFn: ({productName, productImageUrl, inStock, skuCode}) => {
    //   return (
    //     productName + '$' + productImageUrl + '$' + inStock + '$' + skuCode
    //   );
    // },
    cell: ({row}) => (
      <WishListProductItem
        productImageUrl={row.getValue('productName')}
        sku={''}
        productName={row.getValue('productName')}
        inStock={false}
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
    cell: ({row}) => <WishlistQuantity />,
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

export function WishListTable({title}: {title: string}) {
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

  return (
    <div className="container bg-grey-25 py-6">
      <h3>{title}</h3>
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

      {/* TODO */}
      {/* Table Pagination Begins Here */}
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="medium"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="medium"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
      {/* Table Pagination Ends Here */}
    </div>
  );
}
