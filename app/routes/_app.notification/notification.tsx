import {Link} from '@remix-run/react';
import {type Notification} from '~/routes/_app.notification/notification.server';

export function Notification({notification}: {notification: Notification}) {
  return (
    <li
      className={`flex justify-between items-center border-grey-50 border-2 p-4 gap-2 ${
        notification.status === 'NEW' && 'border-primary-400 bg-primary-50'
      }`}
    >
      <p className="text-grey-900 text-lg italic font-normal leading-6">
        {notification.message}
      </p>
      <Link to="">
        <button className="text-[14px] italic font-bolf leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
          view
        </button>
      </Link>
    </li>
  );
}
