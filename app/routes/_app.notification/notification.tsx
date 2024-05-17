import {Link} from '@remix-run/react';

type NotificationType = 'PROMOTION' | 'ORDER' | 'INVOICE';
interface Notification {
  id: number;
  message: string;
  shopifyId: string;
  companyId: string;
  type: NotificationType;
  status: 'NEW' | 'OPENED';
}

export function Notification({notification}: {notification: Notification}) {
  switch (notification.type) {
    case 'INVOICE': {
      return (
        <li
          className={`flex justify-between border-grey-50 border-2 p-4 gap-2 ${
            notification.status === 'NEW' && 'border-primary-400 bg-primary-50'
          }`}
        >
          <div className="flex">
            <p className="mr-2 text-grey-900 text-lg italic font-semibold leading-6">
              date
            </p>
            <p className="text-grey-900 text-lg italic font-semibold leading-6">
              News Order Received- <span>Order No. </span>
            </p>
            <p className="">
              ordererd by{' '}
              <span className="text-grey-900 text-lg italic font-semibold leading-6">
                {' '}
              </span>
            </p>
          </div>
          <Link to="">
            <button className="text-[14px] italic font-bolf leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
              view
            </button>
          </Link>
        </li>
      );
    }
    case 'ORDER': {
      return <h1>Order</h1>;
    }
    case 'PROMOTION': {
      return <h1>Promotion</h1>;
    }
    default: {
      return <h1>Default</h1>;
    }
  }
}
