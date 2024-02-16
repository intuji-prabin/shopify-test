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
  let passwordResetReponse = {} as any
  try {
  passwordResetReponse = await storefront.mutate(RESET_PASSWORD_MUTATION, {
      variables: {
        id: `gid://shopify/Customer/${customerId}`,
        input: {
          password,
          resetToken,
        },
      },
    });
  } catch( error ) {
    throw new Error("Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.")
  }

  const responseError =  passwordResetReponse?.customerReset?.customerUserErrors as any
  if( responseError.length > 0 ) {
      throw new Error( responseError[0]?.message )
  }

  return passwordResetReponse
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
