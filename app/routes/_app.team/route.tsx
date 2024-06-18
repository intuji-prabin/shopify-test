import { useMemo, useState } from 'react';
import { Can } from '~/lib/helpers/Can';
import { validationError } from 'remix-validated-form';
import { Button } from '~/components/ui/button';
import { SearchInput } from '~/components/ui/search-input';
import { Routes } from '~/lib/constants/routes.constent';
import { TabsTable } from '~/routes/_app.team/tabs-table';
import { MetaFunction } from '@shopify/remix-oxygen';
import { BackButton } from '~/components/ui/back-button';
import { TeamError } from '~/routes/_app.team/team-error';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ConfirmationFormSchemaValidator } from '~/routes/_app.team/confirmation-form';
import { DEFAULT_ERRROR_MESSAGE } from '~/lib/constants/default-error-message.constants';
import {
  getAllTeams,
  getRoles,
  updateStatus,
} from '~/routes/_app.team/team.server';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import { AuthError } from '~/components/ui/authError';

export const meta: MetaFunction = () => {
  return [{ title: 'Team List' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    await isAuthenticate(context);

    const { userDetails } = await getUserDetails(request);

    const customerId = userDetails.id;

    const currentUserRole = userDetails.meta.user_role.value;

    const { searchParams } = new URL(request.url);

    const query = searchParams.get('search');
    const isImpersonatingCheck = await isImpersonating(request);

    const teams = await getAllTeams({ request, customerId, query, context });

    const roles = await getRoles({ context, currentUserRole });

    return json({ teams, roles, currentUser: customerId, isImpersonatingCheck });
  } catch (error) {
    if (error instanceof Error) {
      console.log("error", error.message);
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);
  const formData = await request.formData();

  const action = formData.get('_action') as 'activate' | 'deactivate';

  switch (action) {
    case 'activate': {
      const customerId = formData.get('customerId') as string;
      return await updateStatus({ context, customerId, value: 'true', request });
    }
    case 'deactivate': {
      const result = await ConfirmationFormSchemaValidator.validate(formData);

      if (result.error) {
        return validationError(result.error);
      }

      if (result.data.confirmation === 'Deactivate') {
        const customerId = result.data.customerId;
        return await updateStatus({ context, customerId, value: 'false', request });
      }
    }
    default: {
      throw new Error('Unexpected action');
    }
  }
}

export default function TeamPage() {
  const { teams, roles, currentUser, isImpersonatingCheck } = useLoaderData<typeof loader>();

  const [activeDepartmentTab, setActiveDepartmentTab] = useState('all');

  const params = new URLSearchParams();

  const displayedList = useMemo(() => {
    return teams.filter(
      (team) => team.department.value === activeDepartmentTab,
    );
  }, [activeDepartmentTab, params]);

  const shouldRender = useConditionalRender('view_team');

  return (
    shouldRender && (
      <section className="container">
        <div className="flex flex-wrap items-center justify-between gap-2 py-6">
          <BackButton className="capitalize" title="My Team" />
          <Can I="view" a="add_customer">
            <Link to={Routes.TEAM_ADD}>
              <Button type="button" variant="primary">
                add a team member
              </Button>
            </Link>
          </Can>
        </div>
        <div className="flex items-center justify-between p-6 bg-neutral-white">
          <Can I="view" a="search_customers">
            <div className="w-[451px]">
              <SearchInput />
            </div>
          </Can>
        </div>
        <Tabs
          defaultValue={activeDepartmentTab}
          onValueChange={(value) => setActiveDepartmentTab(value)}
          className="table-tabs"
        >
          <TabsList className="justify-start w-full not-italic border-b rounded-none bg-neutral-white overflow-x-auto gap-4 [&>button]:!border-b-[3px] [&>button]:px-4 px-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {roles.map((role) => (
              <TabsTrigger key={role.value} value={role.value}>
                {role.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <TabsTable results={teams} currentUser={currentUser} isImpersonatingCheck={isImpersonatingCheck} />
          </TabsContent>
          {roles.map((role) => (
            <TabsContent key={role.value} value={role.value}>
              <TabsTable results={displayedList} currentUser={currentUser} isImpersonatingCheck={isImpersonatingCheck} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <TeamError />;
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return <TeamError errorMessage={error.message} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}
