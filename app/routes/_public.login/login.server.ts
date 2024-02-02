import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type LoginParams = {
  email: string;
  password: string;
  context: AppLoadContext;
};

type CustomerAddress = {
  address1: string;
};

type Metafield = {
  id: string;
  key: string;
  value: string;
  type: string;
};

type Customer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: CustomerAddress[];
  metafields: {
    nodes: Metafield[];
  };
};

export type CustomerData = {
  meta: Record<string, Metafield>;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: CustomerAddress[];
};

type CustomerResponse = {
  data: {
    customers: {
      nodes: Customer[];
    };
  };
};

function customerDataFormat(customer: Customer) {
  const {metafields, ...customerData} = customer;
  const meta: Record<string, Metafield> = {};

  if (metafields.nodes && metafields.nodes.length > 0) {
    metafields.nodes.forEach((node) => {
      meta[node.key] = {
        id: node.id,
        key: node.key,
        value: node.value,
        type: node.type,
      };
    });
  }

  return {...customerData, meta};
}

export function isUserActive(status: Metafield) {
  return status.value === 'true';
}

export async function getCustomerByEmail({email}: {email: string}) {
  const body = JSON.stringify({
    query: GET_CUSTOMER_QUERY_BY_EMAIL,
    variables: {
      email,
    },
  });

  const customer = await useFetch<CustomerResponse>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!customer.data.customers.nodes[0]) {
    throw new Error('User not found');
  }

  const customerdata = customerDataFormat(customer.data.customers.nodes[0]);
  return customerdata;
}

export async function verifyLogin({email, password, context}: LoginParams) {
  const {storefront} = context;

  const {customerAccessTokenCreate} = await storefront.mutate(LOGIN_MUTATION, {
    variables: {
      input: {email, password},
    },
  });

  if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
    throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
  }

  const {customerAccessToken} = customerAccessTokenCreate;

  return customerAccessToken;
}

const LOGIN_MUTATION = `#graphql
  mutation login($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
` as const;

const GET_CUSTOMER_QUERY_BY_EMAIL = `query getByEmail($email:String!){
  customers(first: 1, query:$email) {
    nodes {
        id
      email
      firstName
      lastName
      phone
      addresses {
        address1
      }
      metafields(first: 10) {
        nodes {
            id
          key
          value
          type
        }
      }
    }
  }
}` as const;
