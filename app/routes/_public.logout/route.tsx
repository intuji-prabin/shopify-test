import {ActionFunctionArgs, redirect} from '@remix-run/server-runtime';
import {logout} from '~/lib/utils/auth-session.server';

export async function loader() {
  return redirect('/');
}

/**
 * Logout Funtionality is in Testing phase
 */
export async function action({context, request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const message = formData.get('message');

  return logout({
    context,
    request,
    logoutMessage: message as string, // Ensure message is of type string
  });
}

// export async function action({context, request}: ActionFunctionArgs) {
//   try {
//     const {storefront} = context;
//     const accessToken = (await getAccessToken(context)) as string;
//     // Access the FormData from the request
//     const formData = await request.formData();

//     // Get the value of the 'message' field from the FormData
//     const message = formData.get('message');

//     await storefront.mutate(LOGOUT_MUTATION, {
//       variables: {
//         customerAccessToken: accessToken,
//       },
//     });
//     return logout({
//       context,
//       request,
//       logoutMessage: message as string, // Ensure message is of type string
//     });
//   } catch (error) {
//     return json({error}, {status: 500});
//   }
// }

// export const LOGOUT_MUTATION = `#graphql
// mutation customerAccessTokenDelete($customerAccessToken: String!) {
//   customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
//     deletedAccessToken
//     deletedCustomerAccessTokenId
//     userErrors {
//       field
//       message
//     }
//   }
// }
// ` as const;
