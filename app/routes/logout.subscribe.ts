import type {LoaderFunctionArgs} from '@remix-run/node';
import {eventStream} from 'remix-utils/sse/server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {emitter} from '~/lib/utils/emitter.server';

export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(data: { customerId: string, message: string }) {
      const eventData = JSON.stringify({ customerId: data.customerId, message: data.message });

      send({ event: EVENTS.LOGOUT.NAME, data: eventData });
    }

    emitter.on(EVENTS.LOGOUT.KEY, handle);

    return function clear() {
      emitter.off(EVENTS.LOGOUT.KEY, handle);
    };
  });
}
