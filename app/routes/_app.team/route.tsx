import {useMemo, useState} from 'react';
import {validationError} from 'remix-validated-form';
import {BackButton} from '~/components/ui/back-button';
import {Button} from '~/components/ui/button';
import {SearchInput} from '~/components/ui/search-input';
import {Routes} from '~/lib/constants/routes.constent';
import {Separator} from '~/components/ui/separator';
import {TabsTable} from '~/routes/_app.team/tabs-table';
import {getRoles} from '~/routes/_app.team_.add/add-team.server';
import {getAllTeams, updateStatus} from '~/routes/_app.team/team.server';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs';
import {ConfirmationFormSchemaValidator} from '~/routes/_app.team/confirmation-form';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
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
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

export async function loader({request, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(context);

  const companyId = userDetails.meta.company_id.value;

  const currentUser = userDetails.id;

  try {
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('search');

    const teams = await getAllTeams({companyId, query});

    const rolesList = await getRoles();

    const roles = rolesList.data.map((role) => ({
      label: role.title,
      value: role.value,
    }));

    return json({teams, roles, currentUser});
  } catch (error) {
    console.log('error', error);
    return json({teams: [], roles: [], currentUser});
  }
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);
  const messageSession = await getMessageSession(request);
  const formData = await request.formData();

  const action = formData.get('_action') as 'activate' | 'deactivate';

  switch (action) {
    case 'activate': {
      try {
        const customerId = formData.get('customerId') as string;

        await updateStatus({customerId, value: 'true'});
        setSuccessMessage(messageSession, 'Customer Activated Successfully');

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await messageCommitSession(messageSession),
            },
          },
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            {error},
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({error}, {status: 400});
      }
    }
    case 'deactivate': {
      try {
        const result = await ConfirmationFormSchemaValidator.validate(formData);

        if (result.error) {
          return validationError(result.error);
        }
        if (result.data.confirmation === 'Deactivate') {
          const customerId = result.data.customerId;
          await updateStatus({customerId, value: 'false'});
        }

        setSuccessMessage(messageSession, 'Customer Deactivated Successfully');

        return json(
          {},
          {
            headers: {
              'Set-Cookie': await messageCommitSession(messageSession),
            },
          },
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            {error},
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({error}, {status: 400});
      }
    }
    default: {
      throw new Error('Unexpected action');
    }
  }
}

export default function TeamPage() {
  const {teams, roles, currentUser} = useLoaderData<typeof loader>();

  const [activeDepartmentTab, setActiveDepartmentTab] = useState('all');
  const params = new URLSearchParams();

  const displayedList = useMemo(() => {
    return teams.filter((team) => team.department === activeDepartmentTab);
  }, [activeDepartmentTab, params]);

  return (
    <section className="container">
      <div className="flex items-center justify-between pt-6 pb-4 ">
        <BackButton title="My Team" />
        <Link to={Routes.TEAM_ADD}>
          <Button type="button" variant="primary">
            add a team member
          </Button>
        </Link>
      </div>
      <Separator className="mb-6" />
      <div className="flex items-center justify-between p-6 bg-neutral-white">
        <div className="w-[451px]">
          <SearchInput />
        </div>
      </div>
      <Tabs
        defaultValue={activeDepartmentTab}
        onValueChange={(value) => setActiveDepartmentTab(value)}
      >
        <TabsList className="bg-neutral-white w-full justify-start rounded-none border-b not-italic">
          <TabsTrigger value="all">All</TabsTrigger>
          {roles.map((role) => (
            <TabsTrigger key={role.value} value={role.value}>
              {role.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <TabsTable results={teams} currentUser={currentUser} />
        </TabsContent>
        {roles.map((role) => (
          <TabsContent key={role.value} value={role.value}>
            <TabsTable results={displayedList} currentUser={currentUser} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
