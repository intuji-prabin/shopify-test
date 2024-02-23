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
import {isAuthenticate, logout} from '~/lib/utils/auth-session.server';
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
import {
  CustomerUpdateInput,
  MailingAddressInput,
} from '@shopify/hydrogen/storefront-api-types';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {
  LOGIN_MUTATION,
  getCustomerByEmail,
} from '../_public.login/login.server';
import {Routes} from '~/lib/constants/routes.constent';
import {fileUpload} from '~/lib/utils/file-upload';
import {LOGOUT_MUTATION} from '../_public.logout/route';

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
      const {status} = await fileUpload({
        customerId,
        file: profileImage,
      });

      if (!status) throw new Error('Image upload unsuccessfull');
    }

    const firstName = fullName.split(' ')[0];
    const lastName = fullName.split(' ')[1] ?? '';

    const customer: CustomerUpdateInput = {};

    customer.email = email;
    customer.firstName = firstName;
    customer.lastName = lastName;
    customer.phone = phoneNumber;

    const updateCustomerDetails = await storefront.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customerAccessToken: accessToken,
          customer,
        },
      },
    );

    if (updateCustomerDetails.customerUpdate?.customerUserErrors?.length) {
      return json(
        {error: updateCustomerDetails.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    userDetailsSession.unset(USER_DETAILS_KEY);

    const customerDetails = await getCustomerByEmail({
      email: userDetails.email,
    });

    userDetailsSession.set(USER_DETAILS_KEY, customerDetails);

    const customerAddress: MailingAddressInput = {};
    customerAddress.address1 = address;

    const updateCustomerAddress = await storefront.mutate(
      CUSTOMER_ADDRESS_UPDATE_MUTATION,
      {
        variables: {
          address: customerAddress,
          customerAccessToken: accessToken,
          id: updateCustomerDetails.customerUpdate.customer.addresses.nodes[0]
            .id,
        },
      },
    );

    if (updateCustomerAddress.customerUpdate?.customerUserErrors?.length) {
      return json(
        {error: updateCustomerAddress.customerUpdate?.customerUserErrors[0]},
        {status: 400},
      );
    }

    if (typeof oldPassword !== 'undefined' && oldPassword !== '') {
      const {customerAccessTokenCreate} = await storefront.mutate(
        LOGIN_MUTATION,
        {
          variables: {
            input: {email, password: oldPassword},
          },
        },
      );

      if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
        throw new Error(
          "Old password doesn't match. Please enter correct old password.",
        );
      }

      const customer: CustomerUpdateInput = {};
      customer.password = password;

      const updatePassword = await storefront.mutate(CUSTOMER_UPDATE_MUTATION, {
        variables: {
          customerAccessToken:
            customerAccessTokenCreate?.customerAccessToken?.accessToken,
          customer,
        },
      });

      if (updatePassword.customerUpdate?.customerUserErrors?.length) {
        return json(
          {error: updatePassword.customerUpdate?.customerUserErrors[0]},
          {status: 400},
        );
      }

      await storefront.mutate(LOGOUT_MUTATION, {
        variables: {
          customerAccessToken: accessToken,
        },
      });

      return logout({context, request});
    }

    setSuccessMessage(messageSession, 'Profile update successfull');

    return redirect(Routes.HOME, {
      headers: [
        ['Set-Cookie', await session.commit({})],
        ['Set-Cookie', await userDetailsCommitSession(userDetailsSession)],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
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
        addresses(first:10){
          nodes{
          id
          address1
      }
     }
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

const CUSTOMER_ADDRESS_UPDATE_MUTATION = `#graphql
  mutation customerAddressUpdate($address: MailingAddressInput!, $customerAccessToken: String!, $id: ID!) {
  customerAddressUpdate(address: $address, customerAccessToken: $customerAccessToken, id: $id) {
    customerAddress {
      id
      address1
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
` as const;
