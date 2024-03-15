import {useEffect, useState} from 'react';
import type {ColumnDef, RowSelectionState} from '@tanstack/react-table';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';

export function useTable<T>(columns: ColumnDef<T>[], data: T[]) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [originalData, setOriginalData] = useState<T[]>(data);

  useEffect(() => {
    setOriginalData(data);
  }, [data]);

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    manualSorting: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel<T>(),
    meta: {
      setOriginalData,
      originalData,
    },
  });
  return {table};
}
