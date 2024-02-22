import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@shopify/remix-oxygen';
import ProfileForm, {
  ProfileFormSchemaValidator,
} from '~/routes/_app.profile/profile-form';
import {
  USER_SESSION_KEY,
  isAuthenticate,
} from '~/lib/utils/auth-session.server';
import {getCustomerById} from '~/routes/_app.team_.$teamId/edit-team.server';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  USER_DETAILS_KEY,
  getUserDetails,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';
import {validationError} from 'remix-validated-form';
import {CustomerUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getCustomerByEmail} from '../_public.login/login.server';
import {Routes} from '~/lib/constants/routes.constent';
import {fileUpload} from '~/lib/utils/file-upload';

export const meta: MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const customerDetails = await getCustomerById({customerId});

  const roles = await getCustomerRolePermission(context);

  return json({customerDetails, roles, customerId});
}

export async function action({request, context}: ActionFunctionArgs) {
  const accessToken = await isAuthenticate(context);
  const {session, storefront} = context;
  console.log('accessToken', accessToken);
  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);

  const {userDetails} = await getUserDetails(request);

  try {
    const result = await ProfileFormSchemaValidator.validate(
      await request.formData(),
    );
    if (result.error) {
      return validationError(result.error);
    }

    console.log('result', result.data);
    const {
      email,
      fullName,
      address,
      oldPassword,
      password,
      phoneNumber,
      customerId,
      profileImage,
    } = result.data;

    if (typeof profileImage !== 'undefined' && customerId) {
      const {status, payload, message} = await fileUpload({
        customerId,
        file: profileImage,
      });

      console.log('statuspayload', status, payload, message);

      if (!status) throw new Error('Image upload unsuccessfull');
    }

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ')[1] ?? '';

    const customer: CustomerUpdateInput = {};

    customer.email = email;
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.password = password;
    customer.phone = phoneNumber;

    const updated = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
        customer,
      },
    });

    if (updated.customerUpdate?.customerUserErrors?.length) {
      console.log('error', updated.customerUpdate?.customerUserErrors[0]);
      return json(
        {error: updated.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    console.log('accessToken');

    session.set(
      USER_SESSION_KEY,
      updated.customerUpdate?.customerAccessToken?.accessToken,
    );

    userDetailsSession.unset(USER_DETAILS_KEY);

    const customerDetails = await getCustomerByEmail({
      email: userDetails.email,
    });

    userDetailsSession.set(USER_DETAILS_KEY, customerDetails);

    console.log('updated', customerDetails);

    setSuccessMessage(messageSession, 'Profile update successfull');

    return redirect(Routes.HOME, {
      headers: [
        ['Set-Cookie', await session.commit({})],
        ['Set-Cookie', await userDetailsCommitSession(userDetailsSession)],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {}
}

export default function ProfilePage() {
  const {customerDetails, roles, customerId} = useLoaderData<typeof loader>();

  return (
    <section className="container">
      <h3 className="py-6">My Profile</h3>
      <ProfileForm
        defaultValues={customerDetails}
        customerId={customerId}
        options={roles.data}
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

const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customerAccessToken: String!,
    $customer: CustomerUpdateInput!
  ) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        email
        firstName
        lastName
        id
        phone
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
` as const;
