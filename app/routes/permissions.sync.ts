import {ActionFunctionArgs} from '@remix-run/node'; // or cloudflare/deno
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import {EVENTS} from '~/lib/constants/events.contstent';
import {emitter2} from '~/lib/utils/emitter.server';


/**
 * Action function to handle permissions updates.
 *
 * This function expects a JSON payload with permission data.
 * The payload is parsed and emitted to subscribers.
 *
 * @param {ActionFunctionArgs} args - The action function arguments.
 * @returns {Promise<boolean>} - A promise that resolves to true.
 */
// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   try {

//     // Emit the permission data to subscribers
//     emitter2.emit(EVENTS.PERMISSIONS_UPDATED.KEY);

//     // Return true to indicate successful execution
//     return true;
//   } catch (error) {
//     console.error('Error processing action:', error);
//     // Return false or throw an error to indicate failure
//     throw new Error('Failed to process action');
//   }
// };

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Parse the JSON payload from the request
    const permissionData = await request.json();
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

