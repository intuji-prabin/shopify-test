import {ColumnDef, Table, flexRender, Row} from '@tanstack/react-table';
import {Fragment} from 'react';
import {BulkTable} from '~/routes/_app.cart-list/order-my-products/bulk-table';
import {
  ArrowUpDown,
  BlueArrowDown,
  BlueArrowUp,
} from '~/components/icons/arrowUpDown';
import {
  Table as TableShadcn,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

type DataTableProps<T> = {
  table: Table<T>;
  columns?: ColumnDef<T>[];
  renderSubComponent?: (props: {row: Row<T>}) => React.ReactElement;
  getRowCanExpand?: (row: Row<T>) => boolean;
};

export function DataTable<T>({
  table,
  columns,
  renderSubComponent,
  getRowCanExpand,
}: DataTableProps<T>) {
  return (
    <TableShadcn className="bg-neutral-white" data-cy="table">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="text-grey-900 text-lg leading-5.5 font-medium whitespace-nowrap"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? 'flex items-center gap-x-2 cursor-pointer'
                          : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      <span className="">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      {header.column.getIsSorted() ? (
                        {
                          asc: <BlueArrowUp />,
                          desc: <BlueArrowDown />,
                        }[(header.column.getIsSorted() as string) ?? null]
                      ) : (
                        <>{header.column.getCanSort() ? <ArrowUpDown /> : ''}</>
                      )}
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      {
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow
                  data-state={row.getIsSelected() && 'selected'}
                  className=" hover:bg-primary-200 data-[state=selected]:bg-primary-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-grey-900 text-lg leading-5.5 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow
                    className={` ${
                      row.getIsSelected() ? 'bg-primary-200 ' : ''
                    } hover:bg-primary-200`}
                  >
                    <TableCell
                      valign="bottom"
                      colSpan={2}
                      className="align-bottom"
                    >
                      <div>
                        <h3 className="capitalize">bulk prices</h3>
                        <p>
                          Explore the pricing options today! We're here to help
                          you find the perfect fit for your business and
                          maximize your savings
                        </p>
                      </div>
                    </TableCell>
                    <TableCell colSpan={3}>
                      {/* <BulkTable quantity={'Quantity'} price={'Price'} /> */}
                      {renderSubComponent && renderSubComponent({row})}
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns && columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      }
    </TableShadcn>
  );
}
