import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {Notification} from '~/routes/_app.notification/notification';
import {MetaFunction} from '@shopify/remix-oxygen';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import EmptyNotification from '~/routes/_app.notification/empty-notification';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  getNotifications,
  viewNotification,
} from '~/routes/_app.notification/notification.server';

export const meta: MetaFunction = () => {
  return [{title: 'New Notifications '}];
};

const PAGE_LIMIT = 6;

export async function loader({request, context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id;

  const {searchParams} = new URL(request.url);

  const baseUrl = `${ENDPOINT.NOTIFICATIONS.GET}/${customerId}/new`;

  const url = generateUrlWithParams({baseUrl, searchParams});

  const {notificationList, totalNotifications} = await getNotifications({
    url,
  });

  return json({notifications: notificationList, totalNotifications});
}
export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id;

  const formData = await request.formData();
  const notificationId = formData.get('notificationId');

  const {redirectLink} = await viewNotification({customerId, notificationId});

  return redirect(redirectLink);
}

export default function NewNotificationPage() {
  const {notifications, totalNotifications} = useLoaderData<typeof loader>();

  if (totalNotifications === 0) {
    return <EmptyNotification />;
  }

  return (
    <>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </ul>

      <PaginationWrapper
        pageSize={PAGE_LIMIT}
        totalCount={totalNotifications}
      />
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
          <p>{DEFAULT_ERRROR_MESSAGE}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
