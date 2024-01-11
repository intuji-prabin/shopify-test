import {ColumnDef, Table, flexRender} from '@tanstack/react-table';
import {LucideArrowDown, LucideArrowUp, LucideArrowUpDown} from 'lucide-react';
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
};

export function DataTable<T>({table, columns}: DataTableProps<T>) {
  return (
    <TableShadcn className="bg-neutral-white">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className="text-grey-900 text-lg leading-5.5 font-medium"
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
                          asc: <LucideArrowUp />,
                          desc: <LucideArrowDown />,
                        }[(header.column.getIsSorted() as string) ?? null]
                      ) : (
                        <>
                          {header.column.getCanSort() ? (
                            <LucideArrowUpDown />
                          ) : (
                            ''
                          )}
                        </>
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="text-grey-900 text-lg leading-5.5"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
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
