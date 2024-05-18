import {Link, useFetcher} from '@remix-run/react';
import {Button} from '~/components/ui/button';
import {type Notification} from '~/routes/_app.notification/notification.server';

function NotificationLink({notification}: {notification: Notification}) {
  switch (notification.type) {
    case 'ORDER': {
      return (
        <Link to={`/order/${notification.shopifyId}`}>
          <button className="text-[14px] italic font-bold leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
            view
          </button>
        </Link>
      );
    }
    case 'PROMOTION': {
      return (
        <Link to={`/customise/${notification.shopifyId}`}>
          <button className="text-[14px] italic font-bold leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
            view
          </button>
        </Link>
      );
    }
    case 'INVOICE': {
      return (
        <Link to={`/invoices/${notification.shopifyId}`}>
          <button className="text-[14px] italic font-bold leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
            view
          </button>
        </Link>
      );
    }
    default:
      return null;
  }
}

export function Notification({notification}: {notification: Notification}) {
  const fetcher = useFetcher();

  const handleView = (notificationId: number) => {
    const formData = new FormData();
    formData.append('notificationId', String(notificationId));
    fetcher.submit(formData, {method: 'PUT'});
  };

  return (
    <li
      className={`flex justify-between items-center border-grey-50 border-2 p-4 gap-2 ${
        notification.status === 'NEW' && 'border-primary-400 bg-primary-50'
      }`}
    >
      <p
        className={`text-lg italic leading-6 ${
          notification.status === 'NEW'
            ? 'font-medium text-grey-900'
            : 'font-normal text-grey-500'
        }`}
      >
        {notification.message}
      </p>
      {notification.status === 'NEW' ? (
        <Button
          type="button"
          variant="link"
          className="before:!bottom-1.5 !px-1"
          onClick={() => handleView(notification.id)}
        >
          view
        </Button>
      ) : (
        <NotificationLink notification={notification} />
      )}
    </li>
  );
}
