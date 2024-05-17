import {LoaderFunctionArgs, MetaFunction, json} from '@shopify/remix-oxygen';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getNotifications} from '../_app.notification/notification.server';
import {useLoaderData} from '@remix-run/react';
import EmptyNotification from '../_app.notification/empty-notification';
import {Notification} from '../_app.notification/notification';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';

export const meta: MetaFunction = () => {
  return [{title: 'Previous Notifications'}];
};

const PAGE_LIMIT = 6;

export async function loader({request, context, params}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id;

  const {searchParams} = new URL(request.url);

  const baseUrl = `${ENDPOINT.NOTIFICATIONS.GET}/${customerId}/opened`;

  const url = generateUrlWithParams({baseUrl, searchParams});

  const {notificationList, totalNotifications} = await getNotifications({
    url,
  });

  return json({notifications: notificationList, totalNotifications});
}

export default function PreviousNotificationPage() {
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
