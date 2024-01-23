import {AppLoadContext} from '@shopify/remix-oxygen';

type CustomerRecoverParams = {email: string; context: AppLoadContext};

export async function customerRecover({email, context}: CustomerRecoverParams) {
  const {storefront} = context;
  return await storefront.mutate(FORGET_PASSWORD_MUTATION, {
    variables: {
      email,
    },
  });
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
