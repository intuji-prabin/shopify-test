import {useActionData, useLoaderData, useNavigate} from '@remix-run/react';
import {validationError} from 'remix-validated-form';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import TeamForm, {
  TeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import {BackButton} from '~/components/ui/back-button';
import {addTeam} from './add-team.server';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {SelectInputType} from '~/components/ui/select-input';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

export async function loader({request}: LoaderFunctionArgs) {
  // await isAuthenticate(request);
  // const results = await fetch(
  //   'https://relaxing-hawk-ace.ngrok-free.app/api/customer-roles',
  // );
  // const roles = await results.json();
  // console.log('roles', roles);
  return json({roles: [{title: 'Admin', value: 'admin'}]});
}

export async function action({request, context}: ActionFunctionArgs) {
  const messageSession = await getMessageSession(request);

  try {
    const result = await TeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const {email, fullName, address, phoneNumber, userRole} = result.data;

    await addTeam({
      address,
      email,
      fullName,
      userRole,
      phoneNumber,
      context,
    });

    setSuccessMessage(messageSession, 'Email sent successfully to customer');

    return json(
      {},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
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
  console.log('roles', roles);
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
      <TeamForm options={roles as SelectInputType[]} />
    </section>
  );
}
