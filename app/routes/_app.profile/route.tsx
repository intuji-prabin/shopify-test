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
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';

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

  const messageSession = await getMessageSession(request);

  const userDetailsSession = await getUserDetailsSession(request);

  const {userDetails} = (await getUserDetails(request)) as any;

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

    const customer: CustomerUpdateInput = {};

    if (typeof oldPassword !== 'undefined' && oldPassword !== '') {
      const {customerAccessTokenCreate}: any = await storefront.mutate(
        LOGIN_MUTATION,
        {
          variables: {
            input: {email: userDetails?.email, password: oldPassword},
          },
        },
      );

      if (customerAccessTokenCreate?.customerUserErrors.length > 0) {
        throw new Error(
          "Old password doesn't match. Please enter correct old password.",
        );
      }

      customer.password = password;
    }

    if (typeof profileImage !== 'undefined' && customerId) {
      const {status} = await fileUpload({
        customerId,
        file: profileImage,
      });

      if (!status) throw new Error('Image upload unsuccessfull');
    }

    const customerName = fullName.split(' ');
    const nameLength = customerName.length;
    let firstName = '';
    let lastName = '';

    if (nameLength > 1) {
      for (let i = 1; i < nameLength; i++) {
        if (i === 1) {
          firstName = customerName[i - 1];
        } else {
          firstName += ` ${customerName[i - 1]}`;
        }
      }
      lastName = customerName[nameLength - 1];
    } else {
      firstName = fullName;
    }

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
          customerAddress: {
            address1: address,
          },
          addressID: userDetails?.address[0]?.id,
        },
      },
    );

    if (updateCustomerDetails.customerUpdate?.customerUserErrors?.length) {
      return json(
        {
          error:
            updateCustomerDetails.customerUpdate?.customerUserErrors[0]
              ?.message,
        },
        {status: 400},
      );
    }

    if (typeof oldPassword !== 'undefined' && oldPassword !== '') {
      await storefront.mutate(LOGOUT_MUTATION, {
        variables: {
          customerAccessToken: accessToken,
        },
      });

      return logout({context, request});
    } else {
      userDetailsSession.unset(USER_DETAILS_KEY);

      const customerDetails = await getCustomerByEmail({
        email: userDetails.email,
      });

      userDetailsSession.set(USER_DETAILS_KEY, customerDetails);
    }

    setSuccessMessage(messageSession, 'Profile update successfull');

    return redirect(Routes.HOME, {
      headers: [
        ['Set-Cookie', await session.commit({})],
        [
          'Set-Cookie',
          await userDetailsCommitSession(userDetailsSession, {
            maxAge: SESSION_MAX_AGE['30_DAYS'],
          }),
        ],
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
  $customer: CustomerUpdateInput!,
  $customerAddress : MailingAddressInput!,
  $addressID : ID!,
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
  },
  customerAddressUpdate( address: $customerAddress, customerAccessToken: $customerAccessToken, id : $addressID  ) {
      customerAddress {
          address1
      }
      customerUserErrors {
          message
          field
      }
  }
}
` as const;
