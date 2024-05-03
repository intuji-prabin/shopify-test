import {useEffect, useState} from 'react';
import {Table} from '@tanstack/react-table';

export function useTableRowSelect<T>({table}: {table: Table<T>}) {
  const [selectedItem, setSelectedItem] = useState<string[]>([]);

  const numberOfSelectedRows = Object.keys(
    table.getState().rowSelection,
  ).length;

  useEffect(() => {
    const selectedRowId = Object.keys(table.getState().rowSelection);
    setSelectedItem(selectedRowId);
  }, [table.getState().rowSelection]);

  return {selectedItem, numberOfSelectedRows};
}
