import {ActionFunctionArgs} from '@remix-run/node'; // or cloudflare/deno
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {EVENTS} from '~/lib/constants/events.contstent';
import {emitter2} from '~/lib/utils/emitter.server';
import {
  USER_DETAILS_KEY,
  getUserDetails,
  getUserDetailsSession,
  userDetailsCommitSession,
} from '~/lib/utils/user-session.server';
import {getCustomerByEmail} from './_public.login/login.server';
import {SESSION_MAX_AGE} from '~/lib/constants/auth.constent';

/**
 * Action function to handle permissions updates.
 *
 * This function expects a JSON payload with permission data.
 * The payload is parsed and emitted to subscribers.
 *
 * @param {ActionFunctionArgs} args - The action function arguments.
 * @returns {Promise<boolean>} - A promise that resolves to true.
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Parse the JSON payload from the request
    const permissionData = await request.json();

    // Log the permission data for debugging purposes
    console.log('permissionData', permissionData);

    // Emit the permission data to subscribers
    emitter2.emit(EVENTS.PERMISSIONS_UPDATED.KEY, permissionData);

    // Return true to indicate successful execution
    return true;
  } catch (error) {
    console.error('Error processing action:', error);
    // Return false or throw an error to indicate failure
    throw new Error('Failed to process action');
  }
};

// export const loader = async ({request}: LoaderFunctionArgs) => {
//   emitter2.emit(EVENTS.PERMISSIONS_UPDATED.KEY, "permission updated");

//   const userDetailsSession = await getUserDetailsSession(request);

//   // Get userDetails
//   const {userDetails} = (await getUserDetails(request)) as any;
//   if (request.method === 'GET') {
//     try {
//       // Clear userDetails from session
//       userDetailsSession.unset(USER_DETAILS_KEY);

//       // Fetch user details from the API
//       const customerDetails = await getCustomerByEmail({
//         email: userDetails.email,
//       });

//       // Update userDetails in session
//       userDetailsSession.set(USER_DETAILS_KEY, customerDetails);
//       emitter2.emit(EVENTS.PERMISSIONS_UPDATED.KEY, customerDetails);

//       // Respond with success message and updated permissions
//       return json(
//         {message: 'success', customerDetails},
//         {
//           headers: {
//             'Set-Cookie': await userDetailsCommitSession(userDetailsSession, {
//               maxAge: SESSION_MAX_AGE['30_DAYS'],
//             }),
//           },
//         },
//       );
//     } catch (error) {
//       // Handle errors
//       console.error('Error fetching user details:', error);
//       return new Response('Error fetching user details', {status: 500});
//     }
//   }
//   // Reject other HTTP methods
//   return null;
// };
