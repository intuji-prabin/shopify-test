import type {LoaderFunctionArgs} from '@remix-run/node';
import {eventStream} from 'remix-utils/sse/server';
import {emitter} from '~/lib/utils/emitter.server';

export async function loader({request}: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(customerId: string) {
      send({event: 'logout-event', data: customerId});
    }

    emitter.on('logout', handle);

    return function clear() {
      emitter.off('logout', handle);
    };
  });
}
