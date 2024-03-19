import {ColumnDef} from '@tanstack/react-table';
import {useTable} from '~/hooks/useTable';
import {DataTable} from '~/components/ui/data-table';

/**
 * Defer Data Table for streaming data
 * @param {ColumnDef<T>[]} columns - Columns
 * @param {T[]} tableData - Table Data
 * @returns {JSX.Element} - Defer Data Table
 */

export function DeferDataTable<T>({
  columns,
  tableData,
}: {
  columns: ColumnDef<T>[];
  tableData: T[];
}) {
  const {table} = useTable(columns, tableData);
  return <DataTable table={table} columns={columns} />;
}
