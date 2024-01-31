import {Link} from '@remix-run/react';

export default function NewsForYou() {
  const news = [
    {
      id: 0,
      date: 'Oct 12 10:00 AM ',
      news: 'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
    {
      id: 1,
      date: 'Oct 12 10:00 AM ',
      news: 'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
    {
      id: 2,
      date: 'Oct 12 10:00 AM ',
      news: 'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
    {
      id: 3,
      date: 'Oct 12 10:00 AM ',
      news: 'New Order Received - Order No. 0005145629 ordered by Catherin McCallum',
      orderNo: ' 0005145629',
      customer: 'Catherin McCallum',
    },
  ];

  return (
    <>
      <ul className="flex gap-2 flex-col">
        {news.map((newsItem) => {
          return (
            <li className="flex justify-between border-grey-50 border-2 p-4 hover:bg-primary-50 hover:border hover:border-primary-400 ">
              <div className="flex">
                <p className="mr-2 text-grey-900 text-lg italic font-semibold leading-6">
                  {newsItem.date}
                </p>
                <p className="text-grey-900 text-lg italic font-semibold leading-6">
                  News Order Received- <span>Order No.{newsItem.orderNo}</span>
                </p>
                <p className="">
                  ordererd by{' '}
                  <span className="text-grey-900 text-lg italic font-semibold leading-6">
                    {' '}
                    {newsItem.customer}
                  </span>
                </p>
              </div>
              <Link to="">
                <button className="text-[14px] italic font-bolf leading-6 uppercase border-t-0 border-2 border-x-0 border-b-primary-500 mb-[2px]">
                  view details
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
