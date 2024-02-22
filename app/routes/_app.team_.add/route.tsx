import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {validationError} from 'remix-validated-form';
import {BackButton} from '~/components/ui/back-button';
import {addTeam} from '~/routes/_app.team_.add/add-team.server';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';
import {SelectInputOptions} from '~/components/ui/select-input';
import TeamForm, {
  AddTeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {MetaFunction} from '@shopify/remix-oxygen';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';

export const meta: MetaFunction = () => {
  return [{title: 'Add Team Member'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const roles = await getCustomerRolePermission(context);
  return json({roles});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);
  const messageSession = await getMessageSession(request);

  try {
    const result = await AddTeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email, fullName, address, phoneNumber, userRole, profileImage} =
      result.data;

    const team = await addTeam({
      address,
      email,
      fullName,
      userRole,
      phoneNumber,
      context,
      request,
      file: profileImage,
    });

    if (team?.status) {
      setSuccessMessage(messageSession, 'Email sent successfully to customer');
      return redirect(Routes.TEAM, {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {},
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

export default function AddTeam() {
  const {roles} = useLoaderData<typeof loader>();

  return (
    <section className="container">
      <div className="py-6">
        <BackButton title="Add Team Memeber" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.TEAM}>My Team</BreadcrumbItem>
          <BreadcrumbItem href={Routes.TEAM_ADD} className="text-grey-900">
            Add Team Member
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <TeamForm options={roles?.data as SelectInputOptions[]} />
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
