import { ActionFunctionArgs } from '@remix-run/node'; // or cloudflare/deno
import { EVENTS } from '~/lib/constants/events.contstent';
import { emitter } from '~/lib/utils/emitter.server';

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
  // Parse the JSON payload from the request
  const permissionData = await request.json();

  // Log the permission data for debugging purposes
  console.log('permissionData', permissionData);

  // Emit the permission data to subscribers
  emitter.emit(EVENTS.PERMISSIONS_UPDATED.KEY, permissionData);

  // Return true to indicate successful execution
  return true;
};
