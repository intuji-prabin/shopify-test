import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {
  CreateTicketForm,
  CreateTicketFormFieldValidator,
} from './create-ticket-form';
import {Routes} from '~/lib/constants/routes.constent';
import {validationError} from 'remix-validated-form';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';
import {useLoaderData} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Create Ticket'}];
};
export type CreateTicketResponse = {
  status: boolean;
  message: string;
  payload: [];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const roles = await getCustomerRolePermission(context);

  return json({roles});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails.id.split('/').pop();
  console.log('customerId', customerId);

  try {
    const result = await CreateTicketFormFieldValidator.validate(
      await request.formData(),
    );
    if (result.error) {
      return validationError(result.error);
    }
    const date = new Date(result.data.date);

    const body = JSON.stringify({
      ...result.data,
      date,
      customerId,
    });

    const results = await useFetch<CreateTicketResponse>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.SUPPORT.CREATE_TICKET}/${customerId}`,
      body,
    });

    console.log(results);

    return json({});
  } catch (error) {}
}

export default function CreateTicketPage() {
  const {roles} = useLoaderData<typeof loader>();
  return (
    <section className="container">
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
      <CreateTicketForm />
    </section>
  );
}
