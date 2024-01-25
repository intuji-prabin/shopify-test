import {
  Link,
  useActionData,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
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
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {getAllTeams, updateStatus} from './team.server';
import {ConfirmationFormSchemaValidator} from './confirmation-form';
import {validationError} from 'remix-validated-form';

export async function loader({request, context}: LoaderFunctionArgs) {
  try {
    const results = await getAllTeams();
    return json({results});
  } catch (error) {
    console.log('error', error);

    // return json({});
  }
}

export async function action({request}: ActionFunctionArgs) {
  try {
    const result = await ConfirmationFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }
    console.log('value', result.data);
    if (result.data.confirmation === 'deactivate') {
      const customerId = result.data.customerId;
      const value = 'true';
      await updateStatus({customerId, value});
    }

    return json({});
  } catch (error) {
    console.log('error', error);
    return json({});
  }
}

export default function TeamPage() {
  const {results} = useLoaderData<typeof loader>();
  const {columns} = useColumn();
  const {table} = useTable(columns, results);

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
    </section>
  );
}
