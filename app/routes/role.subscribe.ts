import type {LoaderFunctionArgs} from '@remix-run/node';
import {eventStream} from 'remix-utils/sse/server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {emitter, emitter3} from '~/lib/utils/emitter.server';

export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(roleUpdate: string) {
      send({event: EVENTS.PERMISSIONS_UPDATED.NAME, data: roleUpdate});
    }

    emitter3.on(EVENTS.PERMISSIONS_UPDATED.KEY, handle);

    return function clear() {
      emitter3.off(EVENTS.PERMISSIONS_UPDATED.KEY, handle);
    };
  });
}
