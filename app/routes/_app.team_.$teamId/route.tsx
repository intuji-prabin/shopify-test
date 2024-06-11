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
import { MetaFunction } from '@shopify/remix-oxygen';
import { ArrowLeft, Edit } from 'lucide-react';
import { validationError } from 'remix-validated-form';
import { Button } from '~/components/ui/button';
import { PageNotFound } from '~/components/ui/page-not-found';
import { SelectInputOptions } from '~/components/ui/select-input';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { SESSION_MAX_AGE } from '~/lib/constants/auth.constent';
import { EVENTS } from '~/lib/constants/events.contstent';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { emitter } from '~/lib/utils/emitter.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {
  USER_DETAILS_KEY,
  getUserDetails,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';
import {
  getCustomerById,
  updateTeam,
} from '~/routes/_app.team_.$teamId/edit-team.server';
import TeamForm, {
  EditTeamFormSchemaValidator,
} from '~/routes/_app.team_.add/team-form';
import { getCustomerByEmail } from '~/routes/_public.login/login.server';
import { getRoles } from '~/routes/_app.team/team.server';
import { EditTeamError } from '~/routes/_app.team_.$teamId/edit-team-error';

export const meta: MetaFunction = () => {
  return [{ title: 'Edit Team Member' }];
};

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const customerId = params?.teamId as string;

  const { userDetails } = await getUserDetails(request);

  const currentUserRole = userDetails.meta.user_role.value;

  const customerDetails = await getCustomerById({ context, request, customerId });

  const roles = await getRoles({ context, currentUserRole });

  return json({ customerDetails, roles });
}

export async function action({ request, context, params }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);

  const { userDetails } = await getUserDetails(request);

  try {
    const result = await EditTeamFormSchemaValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const customerId = params?.teamId as string;

    const {
      email,
      fullName,
      address,
      phoneNumber,
      userRole,
      profileImage,
      addressId,
    } = result.data;

    await updateTeam({
      address,
      addressId,
      email,
      fullName,
      phoneNumber,
      customerId,
      userRole,
      file: profileImage,
      context,
    });

    //  This must be applied only after implementing the authorization logic
    //  import {emitter} from '~/lib/utils/emitter.server';
    //  if (!isNotAdmin) {
    //    emitter.emit('logout', customerId);
    //  }

    if (userDetails?.email === email) {
      userDetailsSession.unset(USER_DETAILS_KEY);

      const customerDetails = await getCustomerByEmail({
        context,
        email: userDetails.email,
      });

      userDetailsSession.set(USER_DETAILS_KEY, customerDetails);

      setSuccessMessage(messageSession, 'Customer update successful');

      return redirect(Routes.TEAM, {
        headers: [
          [
            'Set-Cookie',
            await userDetailsCommitSession(userDetailsSession, {
              maxAge: SESSION_MAX_AGE['30_DAYS'],
            }),
          ],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      });
    }
    // emitter.emit(EVENTS.LOGOUT.KEY, email);
    emitter.emit(EVENTS.LOGOUT.KEY, {
      customerId: customerId,
      message: 'User Role Changed Logging Out',
    });

    setSuccessMessage(messageSession, 'Customer update successful');

    return redirect(Routes.TEAM, {
      headers: [['Set-Cookie', await messageCommitSession(messageSession)]],
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

  const { customerDetails, roles } = useLoaderData<typeof loader>();

  const shouldRender = useConditionalRender('edit_other_profile');

  return (
    shouldRender && (
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
          addressId={customerDetails?.addressId}
          customerId={customerDetails?.customerId}
          options={roles as SelectInputOptions[]}
        />
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <EditTeamError />;
  } else if (error instanceof Error) {
    return <EditTeamError errorMessage={error.message} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}
