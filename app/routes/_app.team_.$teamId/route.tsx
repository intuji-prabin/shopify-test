import {useLoaderData, useNavigate} from '@remix-run/react';
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
import {Separator} from '~/components/ui/separator';
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
import { getCustomerRolePermission } from '~/lib/customer-role/customer-role-permission';

interface Role {
  title: string;
  value: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  title: string;
  value: string;
}

interface RolesResponse {
  data: Role[];
  message: string;
  status: boolean;
}

export const meta: MetaFunction = () => {
  return [{title: 'Edit Team Member'}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  let customerId = params?.teamId as string;
  console.log("xczxcxz", customerId)
  const customerDetails = await getCustomerById({customerId});

  const roles = await getCustomerRolePermission( context ) as RolesResponse;

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
        customerId={customerDetails.customerId}
        options={roles.data as SelectInputOptions[]}
      />
    </section>
  );
}
