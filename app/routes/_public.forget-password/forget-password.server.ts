import {AppLoadContext} from '@shopify/remix-oxygen';

type CustomerRecoverParams = {email: string; context: AppLoadContext};

export async function customerRecover({email, context}: CustomerRecoverParams) {
  try {
    const {storefront} = context;
    return await storefront.mutate(FORGET_PASSWORD_MUTATION, {
      variables: {
        email,
      },
    });
  } catch( error ) {
    throw new Error("Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding")
  }
}

const FORGET_PASSWORD_MUTATION = `#graphql 
  mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      field
      message
    }
  }
}` as const;
