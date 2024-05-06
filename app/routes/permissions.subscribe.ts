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
    
    const handle = (email: string)=>{
      send({event: EVENTS.PERMISSIONS_UPDATED.NAME, data: String(Date.now())})
    }

    emitter2.addListener(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    // Remove the event listener when the event stream is closed
    return () => {
      console.log("listener")
      emitter2.removeListener(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
    };
  });
}


