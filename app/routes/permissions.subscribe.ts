// routes/permissions-subscribe.ts

import { LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {  emitter2 } from '~/lib/utils/emitter.server';
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

export async function loader({ request }: LoaderFunctionArgs) {
  // Move this logic to server middleware or framework initialization code
  // to ensure it persists across page loads
  return eventStream(request.signal, function setup(send) {
    
    const handle = (permissionData: object) => {
      const eventData = JSON.stringify({ permissionData });
      // send({ event: EVENTS.PERMISSIONS_UPDATED.NAME, data: String(Date.now()) });
      send({ event: EVENTS.PERMISSIONS_UPDATED.NAME, data: eventData });

    };

    emitter2.addListener(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    // Remove the event listener when the event stream is closed
    return () => {
      emitter2.removeListener(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
    };
  });
}

// export async function loader({request}: LoaderFunctionArgs) {
//   return eventStream(request.signal, function setup(send) {
//     function handle(permissionData: object) {
//       const permissionDataString = JSON.stringify(permissionData);
//       send({event: EVENTS.PERMISSIONS_UPDATED.NAME, data: permissionDataString});
//     }

//     emitter2.on(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

//     return function clear() {
//       emitter2.off(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
//     };
//   });
// }



