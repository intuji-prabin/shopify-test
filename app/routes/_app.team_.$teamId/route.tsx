import { useLoaderData, useNavigate } from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import { ArrowLeft } from 'lucide-react';
import { validationError } from 'remix-validated-form';
import { Button } from '~/components/ui/button';
import { SelectInputOptions } from '~/components/ui/select-input';
import { Separator } from '~/components/ui/separator';
import { useFetch } from '~/hooks/useFetch';
import { ENDPOINT } from '~/lib/constants/endpoint.constant';
import { Routes } from '~/lib/constants/routes.constent';
import TeamForm, { EditTeamFormSchemaValidator, EditTeamFormType } from '~/routes/_app.team_.add/team-form';
import { editTeam, getCustomerDetail } from './edit-team.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

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
  msg: string;
  status: boolean;
}

export async function loader({ params }: LoaderFunctionArgs) {
  /**
   * @description dummy data
   */

  let customer_id = params?.teamId as string
  const results = await getCustomerDetail({ customer_id })
  const customer = results?.data?.customer

  const customer_detail: Omit<EditTeamFormType, 'profileImage'> & {
    profileImageUrl: string;
  } = {
    fullName: customer?.displayName,
    email: customer?.email,
    phoneNumber: customer?.phone,
    address: customer?.addresses?.length > 0 ? customer?.addresses[0].address1 : "defaultAddress",
    userRole: customer?.metafields?.nodes ? customer?.metafields?.nodes.filter((meta: any) => meta.key === 'role')[0].value : "",
    customerId: customer_id,
    profileImageUrl: customer?.profileImage ? customer?.profileImage : DEFAULT_IMAGE.DEFAULT
  };

  const roles = (await useFetch({ url: ENDPOINT.ROLE.GET })) as RolesResponse;

  return json({ results: customer_detail, customer_id, roles });
}
export async function action({ request }: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);
  try {
    const result = await EditTeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }
    const formData = new FormData();
    formData.append('file', result.submittedData.profileImage);

    console.log('File details:', {
      name: result.submittedData.profileImage.name,
      size: result.submittedData.profileImage.size,
      type: result.submittedData.profileImage.type,
    });

    const { email, fullName, address, phoneNumber, userRole, customerId } = result.data;

    await editTeam({ address, email, fullName, phoneNumber, customerId, userRole });

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
    return json({ error }, { status: 400 });
  }
}
export default function TeamDetailsPage() {
  const navigate = useNavigate();
  const { results, customer_id, roles } = useLoaderData<typeof loader>();

  return (
    <section className="container">
      <div className="flex items-center pt-6 pb-4 space-x-4">
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
      <Separator className="mt-4 mb-8" />
      <TeamForm defaultValues={results} companyId={customer_id} options={roles.data as SelectInputOptions[]} />
    </section>
  );
}
