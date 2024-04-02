import {isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {EmptyArrow} from '~/components/icons/emptyArrow';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {deletePlaceAnOrderList} from '~/routes/_app.place-an-order.list/place-an-order-list.server';

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  await deletePlaceAnOrderList({request});

  return null;
}

export default function PlaceAnOrderIndexPage() {
  return (
    <div className="container flex justify-center mt-12 mb-[488px]">
      <div className="flex items-center gap-4">
        <EmptyArrow />
        <div className="space-y-4 text-center">
          <h3>It seems like your List is empty.</h3>
          <p className="text-lg leading-5.5 text-grey-900">
            Use <span className="font-medium">Rapid Product Search</span> to
            instantly search product and add to the list.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
