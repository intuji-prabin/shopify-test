import {useState} from 'react';
import type {
  ColumnDef,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

export function useTable<T>(columns: ColumnDef<T>[], data: T[]) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel<T>(),
    getSortedRowModel: getSortedRowModel<T>(),
  });
  return {table, sorting, setSorting};
}
