import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import {AuthError} from '~/components/ui/authError';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {EVENTS} from '~/lib/constants/events.contstent';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {AuthErrorHandling} from '~/lib/utils/authErrorHandling';
import {emitter} from '~/lib/utils/emitter.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import EmptyNotification from '~/routes/_app.notification/empty-notification';
import {Notification} from '~/routes/_app.notification/notification';
import {
  getNotifications,
  viewNotification,
} from '~/routes/_app.notification/notification.server';
import {getNewNotificationCount} from '../_app/app.server';

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
    context,
    request,
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
  const messageSession = await getMessageSession(request);

  try {
    const {redirectLink, message} = await viewNotification({
      context,
      request,
      customerId,
      notificationId,
    });
    notificationId === null && setSuccessMessage(messageSession, message);
    const {totalNotifications} = await getNewNotificationCount({
      context,
      customerId,
      request,
    });
    emitter.emit(EVENTS.NOTIFICATIONS_UPDATED.KEY, {
      payload: {
        type: 'notification',
        action: 'view',
        totalNumber: totalNotifications,
        companyId: userDetails.meta?.company_id.companyId,
        customerId: userDetails.id,
      },
    });

    return redirect(redirectLink, {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {
    let message = 'Something went wrong. Please try again later.';
    if (error instanceof Error) {
      message = error.message;
      notificationId === null && setErrorMessage(messageSession, message);
    }
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  }
}

export default function NewNotificationPage() {
  const { notifications, totalNotifications } = useLoaderData<typeof loader>();

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
    if(AuthErrorHandling( error.message )){ 
      return <AuthError errorMessage={error.message} />
    }
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
