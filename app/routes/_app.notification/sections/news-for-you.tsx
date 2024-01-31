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
      <ul>
        {news.map((newsItem) => {
          return (
            <li className="flex justify-between">
              <div className="flex">
                <p className="mr-2">{newsItem.date}</p>
                <p>
                  News Order Received- <span>Order No.{newsItem.orderNo}</span>
                </p>
                <p>ordererd by {newsItem.customer}</p>
              </div>
              <div>
                <p>view details</p>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
