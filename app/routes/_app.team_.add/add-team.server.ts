import {AppLoadContext} from '@shopify/remix-oxygen';
import {ADMIN_ACCESS_TOKEN} from '~/lib/constants/auth.constent';

type AddTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context: AppLoadContext;
  userRole: string;
};
export async function addTeam({
  address,
  context,
  email,
  fullName,
  userRole,
  phoneNumber,
}: AddTeamParams) {
  const {storefront} = context;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];
  const team = await storefront.mutate(CREATE_TEAM_MUTATION, {
    variables: {
      input: {
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        password: 'defaultPass',
      },
    },
  });

  if (team.customerCreate.customerUserErrors.length > 0) {
    console.log(
      'error on creating user',
      team.customerCreate.customerUserErrors[0],
    );
    return;
  }
  const BODY = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: UPDATE_TEAM_MUTATION,
      variables: {
        customer: {
          id: team?.customerCreate?.customer?.id,
          addresses: {
            address1: address,
          },
        },
        meta: [
          {
            ownerId: team?.customerCreate?.customer?.id,
            namespace: 'auth',
            key: 'role',
            value: userRole,
            type: 'string',
          },
          {
            ownerId: team?.customerCreate?.customer?.id,
            namespace: 'company',
            key: 'company_id',
            value: 'abc123',
            type: 'string',
          },
        ],
      },
    }),
  };
  const response = await fetch(
    'https://intuji-test.myshopify.com/admin/api/2023-10/graphql.json',
    BODY,
  );
  const data = await response.json();
  console.log('data', data);
  const emailSend = await customerRecover({email, context});
  if (!emailSend) {
    throw new Error('email not send');
  }
  return team;
}

const CREATE_TEAM_MUTATION = `#graphql 
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
       id
    }
    customerUserErrors {
      field
      message
    }
  }
}
` as const;

const UPDATE_TEAM_MUTATION = `
  mutation updateCustomerWithMeta($customer: CustomerInput!, $meta: [MetafieldsSetInput!]!) {
    customerUpdate(input: $customer) {
      customer {
        id
      }
    }
    metafieldsSet(metafields: $meta) {
      metafields {
        key
        value
      }
    }
  }
` as const;

type CustomerRecoverParams = {email: string; context: AppLoadContext};

export async function customerRecover({email, context}: CustomerRecoverParams) {
  const {storefront} = context;
  return await storefront.mutate(FORGET_PASSWORD_MUTATION, {
    variables: {
      email,
    },
  });
}

const FORGET_PASSWORD_MUTATION =
  `#graphql mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      field
      message
    }
  }
}` as const;
