import {isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {EmptyArrow} from '~/components/icons/emptyArrow';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {deletePlaceAnOrderList} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import EmptyList from '~/components/ui/empty-list';

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  await deletePlaceAnOrderList({request});

  return null;
}

export default function PlaceAnOrderIndexPage() {
  return (
    <EmptyList />
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
