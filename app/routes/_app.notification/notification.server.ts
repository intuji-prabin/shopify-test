import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

interface DefaultResponse {
  status: boolean;
  message: string;
}

export interface Notification {
  id: number;
  message: string;
  shopifyId: string;
  companyId: string;
  type: 'PROMOTION' | 'ORDER' | 'INVOICE';
  status: 'NEW' | 'OPENED';
}

type Payload = {
  totalNotifications: number;
  notificationList: Notification[];
};

interface NotificationsResponse extends DefaultResponse {
  payload: Payload;
}

export async function getNotifications({url}: {url: string}) {
  try {
    const response = await useFetch<NotificationsResponse>({url});

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
