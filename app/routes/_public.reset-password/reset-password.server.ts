import {AppLoadContext} from '@shopify/remix-oxygen';

type ChangePasswordParams = {
  resetToken: string;
  customerId: string;
  password: string;
  context: AppLoadContext;
};

export async function changePassword({
  password,
  context,
  customerId,
  resetToken,
}: ChangePasswordParams) {
  const {storefront} = context;
  return await storefront.mutate(RESET_PASSWORD_MUTATION, {
    variables: {
      id: `gid://shopify/Customer/${customerId}`,
      input: {
        password,
        resetToken,
      },
    },
  });
}

const RESET_PASSWORD_MUTATION = `#graphql 
mutation customerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customer {
        displayName
      }
      customerAccessToken {
       accessToken
      }
      customerUserErrors {
        field
        message
      }
    }
  }` as const;
