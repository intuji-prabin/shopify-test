import {ActionFunctionArgs} from '@remix-run/node'; // or cloudflare/deno
import {json} from '@remix-run/server-runtime';

import {EVENTS} from '~/lib/constants/events.contstent';
import { notificationAuthorization } from '~/lib/constants/notification.api.authorization';
import { permissionAuthorization } from '~/lib/constants/permisson.api.authorization';
import {emitter} from '~/lib/utils/emitter.server';

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
      // Call the permissionAuthorization function
      permissionAuthorization(request);
  
      // Parse the JSON payload from the request
      const notificationData = await request.json();
  
      // Emit the permission data to subscribers
      emitter.emit(EVENTS.NOTIFICATIONS_UPDATED.KEY, notificationData);
  
      // Return true to indicate successful execution
      return json(
        { status: true, message: 'Notification Updated successfully' }, // Fixed typo in the message
        { status: 200 }
      );
    } catch (error) {
      let message = 'Failed to process action';
      if (error instanceof Error) {
        console.log('error', error);
        message = error.message;
      }
      return json({ status: false, message }, { status: 400 });
    }
  };