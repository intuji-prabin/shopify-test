import {Link, useSearchParams} from '@remix-run/react';
import {BackButton} from '~/components/ui/back-button';
import {Button} from '~/components/ui/button';
import {SearchInput} from '~/components/ui/search-input';
import {useColumn} from '~/routes/_app.team/use-column';
import {TeamData} from './team-data';
import {DataTable} from '~/components/ui/data-table';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {useTable} from '~/hooks/useTable';
import {Routes} from '~/lib/constants/routes.constent';
import {Separator} from '~/components/ui/separator';

export default function TeamPage() {
  const {columns} = useColumn();
  const {table} = useTable(columns, TeamData);

  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex justify-between items-center">
        <BackButton title="My Team" />
        <Link to={Routes.TEAM_ADD}>
          <Button type="button" variant="primary">
            add a team memeber
          </Button>
        </Link>
      </div>
      <Separator className="mb-6" />
      <div className="flex items-center justify-between bg-neutral-white p-6">
        <div className="w-[451px]">
          <SearchInput />
        </div>
      </div>
      <DataTable table={table} />
      <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
        <p className="w-40 text-grey-400 font-medium">
          1-7 of {TeamData.length} Items
        </p>
        <PaginationWrapper pageSize={5} totalCount={TeamData.length} />
      </div>
    </section>
  );
}
