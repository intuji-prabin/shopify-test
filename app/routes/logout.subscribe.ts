import type {LoaderFunctionArgs} from '@remix-run/node';
import {eventStream} from 'remix-utils/sse/server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {emitter} from '~/lib/utils/emitter.server';

export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(customerId: string) {
      send({event: EVENTS.LOGOUT.NAME, data: customerId});
    }

    emitter.on(EVENTS.LOGOUT.KEY, handle);

    return function clear() {
      emitter.off(EVENTS.LOGOUT.KEY, handle);
    };
  });
}
