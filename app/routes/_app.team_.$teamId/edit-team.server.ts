import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export async function getCustomerDetail({customer_id}: {customer_id: string}) {
  const body = JSON.stringify({
    query: GET_CUSTOMER_DETAIL,
    variables: {
      id: `gid://shopify/Customer/${customer_id}`,
    },
  });

  const results = await useFetch<any>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results) {
    throw new Error("Couldn't get user data");
  }

  return results;
}

const GET_CUSTOMER_DETAIL = `#graphql
query GetCustomerDetail($id:ID!){
    customer(id:$id) {
        email
        displayName
        phone
        addresses {
          address1
        }
        metafields(first: 10) {
          nodes {
            key
            value
          }
        }
      }
  }
` as const;

type EditTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context?: AppLoadContext;
  userRole: string;
  customerId: string;
};
export async function editTeam({
  address,
  email,
  fullName,
  userRole,
  phoneNumber,
  customerId,
}: EditTeamParams) {
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];

  const body = JSON.stringify({
    query: UPDATE_TEAM_MUTATION,
    variables: {
      customer: {
        id: `gid://shopify/Customer/${customerId}`,
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        addresses: {
          address1: address,
        },
      },
      meta: [
        {
          ownerId: `gid://shopify/Customer/${customerId}`,
          namespace: 'auth',
          key: 'role',
          value: userRole,
          type: 'string',
        },
      ],
    },
  });

  const results = await useFetch({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results) {
    throw new Error("Couldn't create user");
  }
  return results;
}

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
