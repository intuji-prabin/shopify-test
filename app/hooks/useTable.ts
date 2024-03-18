
import {useEffect, useState} from 'react';
import type {ColumnDef, RowSelectionState} from '@tanstack/react-table';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';

export function useTable<T>(columns: ColumnDef<T>[], apiData: T[]) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [data, setData] = useState(apiData);

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
      updateData: (rowIndex: number, columnId: string, value: string) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });
  return {table};
}
