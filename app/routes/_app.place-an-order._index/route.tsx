import {isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {deletePlaceAnOrderList} from '~/routes/_app.place-an-order.list/place-an-order-list.server';
import EmptyList from '~/components/ui/empty-list';
import {RouteError} from '~/components/ui/route-error';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  await deletePlaceAnOrderList({request});

  return null;
}

export default function PlaceAnOrderIndexPage() {
  return <EmptyList placeholder="order" />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <RouteError />;
  } else if (error instanceof Error) {
    return <RouteError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
