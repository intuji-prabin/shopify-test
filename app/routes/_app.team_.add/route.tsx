import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import { MetaFunction } from '@shopify/remix-oxygen';
import { validationError } from 'remix-validated-form';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { SelectInputOptions } from '~/components/ui/select-input';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getRoles } from '~/routes/_app.team/team.server';
import { addTeam } from '~/routes/_app.team_.add/add-team.server';
import TeamForm, {
  AddTeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import { AddTeamError } from './add-team-error';
import { AuthError } from '~/components/ui/authError';

export const meta: MetaFunction = () => {
  return [{ title: 'Add Team Member' }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const currentUserRole = userDetails.meta.user_role.value;

  const roles = await getRoles({ context, currentUserRole });

  return json({ roles });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  try {
    const result = await AddTeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const { email, fullName, address, phoneNumber, userRole, profileImage } =
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

    return json({ error }, { status: 500 });
  }
}

export default function AddTeam() {
  const { roles } = useLoaderData<typeof loader>();

  const shouldRender = useConditionalRender('add_customer');

  return (
    shouldRender && (
      <section className="container">
        <div className="py-6">
          <BackButton title="Add Team Member" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.TEAM}>My Team</BreadcrumbItem>
            <BreadcrumbItem href={Routes.TEAM_ADD} className="text-grey-900">
              Add Team Member
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <TeamForm options={roles as SelectInputOptions[]} />
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <AddTeamError />;
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return <AddTeamError errorMessage={error.message} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}
