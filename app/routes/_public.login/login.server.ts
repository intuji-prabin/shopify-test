import {AppLoadContext} from '@shopify/remix-oxygen';

type LoginParams = {
  email: string;
  password: string;
  context: AppLoadContext;
};

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
