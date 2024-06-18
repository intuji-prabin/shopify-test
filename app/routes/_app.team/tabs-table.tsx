import { DataTable } from '~/components/ui/data-table';
import { useTable } from '~/hooks/useTable';
import { TeamColumn, useColumn } from '~/routes/_app.team/use-column';

export function TabsTable({
  results,
  currentUser,
  isImpersonatingCheck
}: {
  results: TeamColumn[];
  currentUser: string;
  isImpersonatingCheck: string;
}) {
  const { columns } = useColumn({ currentUser, isImpersonatingCheck });

  const { table } = useTable(columns, results);

  return <DataTable table={table} columns={columns} />;
}
