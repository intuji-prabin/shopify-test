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
    };
  });
}
