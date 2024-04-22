import HeroBanner from '~/components/ui/hero-section';
import UploadSearchbar from '~/components/ui/upload-csv-searchbar';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from '@shopify/remix-oxygen';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {Outlet, isRouteErrorResponse, useRouteError} from '@remix-run/react';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {addProductToList} from '~/routes/_app.place-an-order/place-an-order.server';

export const meta: MetaFunction = () => {
  return [{title: 'Place an Order'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return null;
}

export async function action({context, request}: ActionFunctionArgs) {
  await isAuthenticate(context);

  console.log('action function called');

  const {userDetails} = await getUserDetails(request);

  const messageSession = await getMessageSession(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const contentType = request.headers.get('Content-Type');

  if (contentType === 'application/json') {
    const jsonPayload = await request.json();
    console.log('json payload', jsonPayload);

    return null;
  }

  const formData = await request.formData();

  const action = formData.get('_action') as 'add_product';

  switch (action) {
    case 'add_product': {
      try {
        const response = await addProductToList({formData, customerId});

        setSuccessMessage(messageSession, response.message);

        return redirect('/place-an-order/list', {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(messageSession, error.message);
          return json(
            {error},
            {
              headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
              },
            },
          );
        }
        return json({error}, {status: 500});
      }
    }
    default:
      break;
  }
}

export default function PlaceAnOrderPage() {
  return (
    <>
      <HeroBanner
        imageUrl={'/place-order.png'}
        sectionName={'PLACE AN ORDER'}
      />
      <UploadSearchbar
        searchVariant="place_an_order"
        action="/place-an-order"
      />
      <Outlet />
    </>
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
