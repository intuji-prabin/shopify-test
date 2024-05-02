<<<<<<< HEAD
// routes/permissions-subscribe.ts

import {LoaderFunction, LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {USER_DETAILS_KEY, getUserDetails, getUserDetailsSession, userDetailsCommitSession} from '~/lib/utils/user-session.server';
import { getCustomerByEmail } from './_public.login/login.server';
import { SESSION_MAX_AGE } from '~/lib/constants/auth.constent';
import { emitter, emitter2 } from '~/lib/utils/emitter.server';
import { EVENTS } from '~/lib/constants/events.contstent';
import { eventStream } from 'remix-utils/sse/server';

/**
 * This loader function handles the subscription process for permissions.
 * It is responsible for fetching the user details and updating the permissions.
 * 
 * @param {Object} context - The context object containing the request.
 * @param {Request} context.request - The request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
// export let loader: LoaderFunction = async ({request}: {request: Request}) => {
//   // Get userDetails session
//   const userDetailsSession = await getUserDetailsSession(request);

//   // Get userDetails
//   const {userDetails} = (await getUserDetails(request)) as any;

//   try {
//     emitter.emit(EVENTS.PERMISSIONS_UPDATED.KEY, EVENTS.PERMISSIONS_UPDATED.NAME);
//   } catch (error) {
//     console.log("ERROR", error);
//   }
//   // // Handle GET requests for subscription
//   // if (request.method === 'GET') {
//   //   try {
//   //     // Clear userDetails from session
//   //     userDetailsSession.unset(USER_DETAILS_KEY);

//   //     // Fetch user details from the API
//   //     const customerDetails = await getCustomerByEmail({
//   //       email: userDetails.email,
//   //     });

//   //     // Update userDetails in session
//   //     userDetailsSession.set(USER_DETAILS_KEY, customerDetails);

//   //   console.log("customerDetails",customerDetails);


//   //     // Respond with success message and updated permissions
//   //     return json({message: "success",customerDetails}, {
//   //       headers: {
//   //         "Set-Cookie": await userDetailsCommitSession(userDetailsSession, {
//   //           maxAge: SESSION_MAX_AGE['30_DAYS'],
//   //         }),
//   //       },
//   //     }); 
  
//   // } catch (error) {
//   //     // Handle errors
//   //     console.error('Error fetching user details:', error);
//   //     return new Response('Error fetching user details', {status: 500});
//   //   }
//   // }

//   // Reject other HTTP methods
//   return null;
// };


export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(permissionData: object) {
      const permissionDataString = JSON.stringify(permissionData);
      send({event: EVENTS.PERMISSIONS_UPDATED.NAME, data: permissionDataString});
    }

    emitter2.on(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    return function clear() {
      emitter2.off(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
=======
// permissions.subscribe.ts

import type { LoaderFunctionArgs } from '@remix-run/node';
import { eventStream } from 'remix-utils/sse/server';
import { EVENTS } from '~/lib/constants/events.contstent';
import { emitter } from '~/lib/utils/emitter.server';
import { getUserDetails } from '~/lib/utils/user-session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // Fetch userDetails
  const { userDetails } = await getUserDetails(request);
  const permissions = userDetails?.meta?.user_role;
  console.log('permissions', permissions);

  // Create an event stream to send permissions data
  return eventStream(request.signal, function setup(send) {
    // Function to handle permissions update
    async function handle() {
      send({ event: EVENTS.PERMISSIONS_UPDATED.NAME, data: JSON.stringify(permissions) });
    }

    // Listen for permissions update event
    emitter.on(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    // Clear event listener when request is aborted
    return function clear() {
      emitter.off(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
>>>>>>> 10f1729fc01ae0d3086de9761086caca8f9f3e7c
    };
  });
}
