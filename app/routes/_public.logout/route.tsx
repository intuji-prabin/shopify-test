import {ActionFunctionArgs, json, redirect} from '@remix-run/server-runtime';
import {getAccessToken, logout} from '~/lib/utils/auth-session.server';

export async function loader() {
  return redirect('/');
}

export async function action({context, request}: ActionFunctionArgs) {
  
  try {
    const {storefront} = context;
    const accessToken = (await getAccessToken(context)) as string;
    // Access the FormData from the request
    const formData = await request.formData();

    // Get the value of the 'message' field from the FormData
    const message = formData.get('message');

    await storefront.mutate(LOGOUT_MUTATION, {
      variables: {
        customerAccessToken: accessToken,
      },
    });
    return logout({context, request, logoutMessage: message as string // Ensure message is of type string
  });
  } catch (error) {
    return json({error}, {status: 400});
  }
}



export const LOGOUT_MUTATION = `#graphql 
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
