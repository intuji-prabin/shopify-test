import {
  isRouteErrorResponse,
  useLoaderData,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {ArrowLeft} from 'lucide-react';
import {validationError} from 'remix-validated-form';
import {Button} from '~/components/ui/button';
import {SelectInputOptions} from '~/components/ui/select-input';
import {Routes} from '~/lib/constants/routes.constent';
import TeamForm, {
  EditTeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import {
  editTeam,
  getCustomerById,
} from '~/routes/_app.team_.$teamId/edit-team.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';
import {MetaFunction} from '@shopify/remix-oxygen';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';
import {isAuthenticate} from '~/lib/utils/authsession.server';

export const meta: MetaFunction = () => {
  return [{title: 'Edit Team Member'}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const customerId = params?.teamId as string;

  const customerDetails = await getCustomerById({customerId});

  const roles = await getCustomerRolePermission(context);

  return json({customerDetails, roles});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);
  try {
    const result = await EditTeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {
      email,
      fullName,
      address,
      phoneNumber,
      userRole,
      customerId,
      profileImage,
    } = result.data;

    await editTeam({
      address,
      email,
      fullName,
      phoneNumber,
      customerId,
      userRole,
      file: profileImage,
      context,
    });

    setSuccessMessage(messageSession, 'Customer edit successful');

    return redirect(Routes.TEAM, {
      headers: {
        'Set-Cookie': await messageCommitSession(messageSession),
      },
    });
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

export default function TeamDetailsPage() {
  const navigate = useNavigate();

  const {customerDetails, roles} = useLoaderData<typeof loader>();

  return (
    <section className="container">
      <div className="flex items-center py-6 space-x-4">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="border-grey-50 hover:bg-inherit"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-grey-400" />
        </Button>
        <h3>Edit Details</h3>
      </div>
      <TeamForm
        defaultValues={customerDetails}
        customerId={customerDetails?.customerId}
        options={roles.data as SelectInputOptions[]}
      />
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
