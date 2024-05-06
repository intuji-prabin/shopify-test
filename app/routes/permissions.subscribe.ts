// routes/permissions-subscribe.ts

import {LoaderFunction, LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {USER_DETAILS_KEY, getUserDetails, getUserDetailsSession, userDetailsCommitSession} from '~/lib/utils/user-session.server';
import { getCustomerByEmail } from './_public.login/login.server';
import { SESSION_MAX_AGE } from '~/lib/constants/auth.constent';
import { emitter, emitter2 } from '~/lib/utils/emitter.server';
import { EVENTS } from '~/lib/constants/events.contstent';
import { eventStream } from 'remix-utils/sse/server';
import { useSubmit } from '@remix-run/react';

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
    function handle(permissionData: object | string) {
      let permissionDataString;
      if (typeof permissionData === 'string') {
        permissionDataString = permissionData; // No need to stringify if it's already a string
      } else {
        permissionDataString = JSON.stringify(permissionData);
      }
      send({ event: EVENTS.PERMISSIONS_UPDATED.NAME, data: permissionDataString });
    }

    emitter2.on(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    return function clear() {
      console.log("CLEARING EVENT STREAM HERE");
      emitter2.off(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
    };
  });
}


