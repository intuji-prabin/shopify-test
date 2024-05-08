import {useFetch} from '~/hooks/useFetch';
import {MetaFunction} from '@shopify/remix-oxygen';
import {setFormDefaults, validationError} from 'remix-validated-form';
import {Routes} from '~/lib/constants/routes.constent';
import {BackButton} from '~/components/ui/back-button';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {getSupportContact} from '~/routes/_app.support_.contact-us/support-contact-us.server';
import {
  CreateTicketForm,
  CreateTicketFormFieldValidator,
} from '~/routes/_app.support_.create-ticket/create-ticket-form';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { useConditionalRender } from '~/hooks/useAuthorization';

export const meta: MetaFunction = () => {
  return [{title: 'Create Ticket'}];
};

export type CreateTicketResponse = {
  status: boolean;
  message: string;
  payload: [];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const supportContact = await getSupportContact({context});

  const {userDetails} = await getUserDetails(request);

  const contactName = `${userDetails.firstName} ${userDetails.lastName}`;

  const departmentOptions = supportContact.map((item) => ({
    title: item.department,
    value: item.id.split('/').pop() as string,
  }));

  return json({
    departmentOptions,
    ...setFormDefaults('create-ticket-form', {
      contactName,
    }),
  });
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop();

  const messageSession = await getMessageSession(request);

  try {
    const result = await CreateTicketFormFieldValidator.validate(
      await request.formData(),
    );

    if (result.error) {
      return validationError(result.error);
    }

    const body = JSON.stringify({
      ...result.data,
      customerId,
    });

    const results = await useFetch<CreateTicketResponse>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.SUPPORT.TICKETS}/${customerId}`,
      body,
    });

    if (!results.status) {
      throw new Error(results.message);
    }

    setSuccessMessage(messageSession, results.message);

    return redirect(Routes.SUPPORT_TICKETS, {
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

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export default function CreateTicketPage() {
  const {departmentOptions} = useLoaderData<typeof loader>();
  const shouldRender = useConditionalRender('open_ticket');

  return (
    shouldRender &&(<section className="container">
      <div className=" pt-6 pb-4">
        <BackButton title="Open A Ticket" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
          <BreadcrumbItem
            href={Routes.SUPPORT_TICKETS_CREATE}
            className="text-grey-900"
          >
            Ticket
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <p className="my-6">
        A remote support session is a collaborative technology-driven
        interaction between a support technician and a user, where the
        technician provides assistance, troubleshooting, or guidance for
        resolving technical issues on the user's device or system. This method
        is widely used in today's digital age and offers several advantages.
      </p>
      <CreateTicketForm options={departmentOptions} />
    </section>)
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
