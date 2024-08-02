import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

interface DefaultResponse {
  status: boolean;
  message: string;
}

type NotificationType = 'PROMOTION' | 'ORDER' | 'INVOICE';
type NotificationStatus = 'NEW' | 'OPENED';
export interface Notification {
  id: number;
  message: string;
  shopifyId: string;
  companyId: string;
  type: NotificationType;
  status: NotificationStatus;
}

type Payload = {
  totalNotifications: number;
  notificationList: Notification[];
};

interface NotificationsResponse extends DefaultResponse {
  payload: Payload;
}

export interface ViewNotification {
  id: number;
  message: string;
  shopifyId: string;
  type: NotificationType;
  createdAt: string;
  updatedAt: string;
}
interface ViewNotificationPayload {
  id: number;
  status: NotificationStatus;
  notificationId: number;
  customerId: string;
  notifications: ViewNotification;
}

interface ViewNotificationResponse extends DefaultResponse {
  payload: ViewNotificationPayload;
}

export async function getNotifications({
  context,
  request,
  url,
}: {
  context: AppLoadContext;
  request: Request;
  url: string;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const response = await useFetch<NotificationsResponse>({
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export function urlBuilder(notification: ViewNotification) {
  switch (notification.type) {
    case 'PROMOTION':
      return `/promotions/available-promotion?id=${notification.shopifyId}`;

    case 'ORDER':
      return `/order/${notification.shopifyId}`;

    case 'INVOICE':
      return `/invoices/${notification.shopifyId}`;

    default:
      return Routes.NOTIFICATIONS_NEW;
  }
}

export async function viewNotification({
  context,
  request,
  customerId,
  notificationId,
}: {
  context: AppLoadContext;
  request: Request;
  customerId: string;
  notificationId: FormDataEntryValue | null;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  const baseUrl = `${ENDPOINT.NOTIFICATIONS.GET}/${customerId}/${
    notificationId === null ? 'mark-as-read' : notificationId
  }`;
  const response = await useFetch<ViewNotificationResponse>({
    url: baseUrl,
    method: AllowedHTTPMethods.PUT,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });

  if (!response.status) {
    throw new Error(response.message);
  }
  const redirectLink = notificationId
    ? urlBuilder(response.payload.notifications)
    : Routes.NOTIFICATIONS_NEW;

  return {redirectLink, message: response?.message};
}
