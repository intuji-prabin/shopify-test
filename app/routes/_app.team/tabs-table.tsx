import {DataTable} from '~/components/ui/data-table';
import {useTable} from '~/hooks/useTable';
import {TeamColumn, useColumn} from '~/routes/_app.team/use-column';

export function TabsTable({results}: {results: TeamColumn[]}) {
  const {columns} = useColumn();
  const {table} = useTable(columns, results);
  return <DataTable table={table} />;
}
