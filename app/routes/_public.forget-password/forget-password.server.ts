import {AppLoadContext} from '@shopify/remix-oxygen';

type CustomerRecoverParams = {email: string; context: AppLoadContext};

export async function passwordRecover({email, context}: CustomerRecoverParams) {
  const {storefront} = context;

  const {customerRecover} = await storefront.mutate(FORGET_PASSWORD_MUTATION, {
    variables: {
      email,
    },
  });

  return {customerRecover};
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
