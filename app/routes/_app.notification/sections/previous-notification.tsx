import {Link} from '@remix-run/react';
import {news} from './notification';

export function EmptyInbox() {
  return (
    <div className="container w-[1440px] h-[942px] flex justify-center items-center">
      <div className="flex flex-col gap-10 max-w-[232px] justify-center items-center">
        <div className="flex item-center flex-col gap-2 text-center">
          <h3>Your inbox is empty.</h3>
          <p className="text-lg font-normal text-grey-800 leading-[22px]">
            Congratulations! You cleared your important notifications
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PreviousNotification() {
  return (
    <>
      <ul className="flex gap-2 flex-col">
        {news.length === 0 ? (
          <EmptyInbox />
        ) : (
          news.map((newsItem) => (
            <li
              key={newsItem.id}
              className=" border-grey-50 border-2 p-4 hover:bg-primary-50 hover:border-primary-400"
            >
              <div className="flex justify-between">
                <div className="flex">
                  <p className="mr-2 text-grey-900 text-lg italic font-semibold leading-6">
                    {newsItem.date}
                  </p>
                  <p className="text-grey-900 text-lg italic font-semibold leading-6">
                    News Order Received-{' '}
                    <span>Order No.{newsItem.orderNo}</span>
                  </p>
                  <p className="">
                    ordered by{' '}
                    <span className="text-grey-900 text-lg italic font-semibold leading-6">
                      {' '}
                      {newsItem.customer}
                    </span>
                  </p>
                </div>
                <Link to="">
                  <button className="text-[14px] italic font-bold leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
                    view details
                  </button>
                </Link>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
}
