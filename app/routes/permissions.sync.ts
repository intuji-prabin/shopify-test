import {ActionFunctionArgs} from '@remix-run/node'; // or cloudflare/deno
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {status} from 'nprogress';
import {EVENTS} from '~/lib/constants/events.contstent';
import {permissionAuthorization} from '~/lib/constants/permisson.api.authorization';
import {emitter} from '~/lib/utils/emitter.server';

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

// export const action = async ({request}: ActionFunctionArgs) => {
//   try {
//     permissionAuthorization(request);
//     // Parse the JSON payload from the request
//     const permissionData = await request.json();
//     console.log('permissionData', permissionData);

//     // Emit the permission data to subscribers
//     emitter2.emit(EVENTS.PERMISSIONS_UPDATED.KEY, permissionData);

//     // Return true to indicate successful execution
//     return json(
//       {status: true, message: 'Permission Changed succussfully'},
//       {status: 200},
//     );
//   } catch (error) {
//     let message = 'Failed to process action';
//     if (error instanceof Error) {
//       console.log('error', error);
//       message = error.message;
//     }
//     return json({status: false, message}, {status: 400});
//   }
// };

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // Call the permissionAuthorization function
    permissionAuthorization(request);

    // Parse the JSON payload from the request
    const permissionData = await request.json();

    // Emit the permission data to subscribers
    emitter.emit(EVENTS.PERMISSIONS_UPDATED.KEY, permissionData);

    // Return true to indicate successful execution
    return json(
      { status: true, message: 'Permission Changed successfully' }, // Fixed typo in the message
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