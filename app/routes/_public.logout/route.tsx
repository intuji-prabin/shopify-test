import {ActionFunctionArgs, json, redirect} from '@remix-run/server-runtime';
import {getAccessToken, logout} from '~/lib/utils/authsession.server';

export async function loader() {
  return redirect('/');
}

export async function action({request, context}: ActionFunctionArgs) {
  try {
    const {storefront} = context;
    const accessToken = (await getAccessToken(request)) as string;
    await storefront.mutate(LOGOUT_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
      },
    });
    return logout(request);
  } catch (error) {
    return json({error}, {status: 400});
  }
}

const LOGOUT_MUTATION = `#graphql 
mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors {
      field
      message
    }
  }
}
` as const;
