import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {OrderStatus} from '../_app.order/order.server';
import {Link} from '@remix-run/react';

export default function OrderNumberDetails({
  orderNumber,
  orderStatus,
}: {
  orderNumber: string;
  orderStatus: OrderStatus;
}) {
  return (
    <>
      <div className="top-card flex justify-between items-center pb-4  border-gray-100 border-x-0 border-b-2 border-t-0">
        <div className="flex justify-between items-center gap-4 ">
          <h4 className="text-2xl italic font-bold leading-[29px] whitespace-nowrap">
            Order No <span>{orderNumber} </span>{' '}
          </h4>
          <OrderStatusChip status={orderStatus} />
        </div>
        <div>
          <Link
            to={`/invoices?search=${orderNumber}`}
            className=" text-gray-900  border-primary-500 border-b-2 border-x-0 border-t-0 p-2 italic font-bold text-[14px] leading-6 uppercase"
          >
            VIEW INVOICES
          </Link>
        </div>
      </div>
    </>
  );
}
