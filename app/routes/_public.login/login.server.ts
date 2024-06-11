import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ImpersonatingUser} from '../_public.impersonate_.$customerId_.$staffId/impersonate.server';
import {isImpersonating} from '~/lib/utils/auth-session.server';

type LoginParams = {
  email: string;
  password: string;
  context: AppLoadContext;
};

type CustomerAddress = {
  id?: string;
  address1: string;
};

type Metafield = {
  key: string;
  value: string;
  name: string;
  companyId: string;
  handle: string;
};

export type CustomerData = {
  meta: Record<string, Metafield>;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  displayName: string;
  addresses: CustomerAddress[];
  impersonateEnable: boolean;
  impersonatingUser: ImpersonatingUser;
};

type CustomerResponse = {
  status: boolean;
  message: string;
  payload: CustomerData;
};

export function isUserActive(status: Metafield) {
  return status?.value === 'true';
}

export async function getCustomerByEmail({
  context,
  email,
}: {
  context: AppLoadContext;
  email: string;
}) {
  const customerResponse = await useFetch<CustomerResponse>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.CUSTOMER.GET}?email=${email}`,
    impersonateEnableCheck: 'false',
    context,
  });
  if (!customerResponse.status) {
    throw new Error(customerResponse.message);
  }

  return customerResponse.payload;
}

export async function verifyLogin({email, password, context}: LoginParams) {
  try {
    const {storefront} = context;
    const {customerAccessTokenCreate} = await storefront.mutate(
      LOGIN_MUTATION,
      {
        variables: {
          input: {email, password},
        },
      },
    );
    if (!customerAccessTokenCreate?.customerAccessToken?.accessToken) {
      throw new Error(customerAccessTokenCreate?.customerUserErrors[0].message);
    }

    const {customerAccessToken} = customerAccessTokenCreate;

    return customerAccessToken;
  } catch (error) {
    if (error instanceof Error) {
      if (error?.message == 'Unidentified customer') {
        throw new Error('Email or password invalid');
      }
    }
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}

export const LOGIN_MUTATION = `#graphql
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
