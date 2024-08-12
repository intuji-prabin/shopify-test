import {Link} from '@remix-run/react';
import {OrderStatusChip} from '~/components/ui/order-status-chip';
import {OrderStatus} from '~/routes/_app.order/order.server';

export default function OrderNumberDetails({
  orderNumber,
  iscalaOrderId,
  orderStatus,
}: {
  orderNumber: string;
  iscalaOrderId: string;
  orderStatus: OrderStatus;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-t-0 border-b-2 border-gray-100 top-card border-x-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h4 className="text-2xl italic font-bold leading-[29px] flex flex-wrap gap-x-1">
          <span>
            Portal ID: {orderNumber}
          </span>
          <span>
            {' | '}
          </span>
          <span>
            Cigweld ID:{' '} {iscalaOrderId.length > 0 ? iscalaOrderId : '-'}
          </span>
        </h4>
        <div>
          <OrderStatusChip status={orderStatus} />
        </div>
      </div>
      <div>
        {iscalaOrderId && iscalaOrderId !== '' && iscalaOrderId !== '-' ? (
          <Link
            to={`/invoices?search=${iscalaOrderId}`}
            className=" text-gray-900  border-primary-500 border-b-2 border-x-0 border-t-0 p-2 italic font-bold text-[14px] leading-6 uppercase"
          >
            VIEW INVOICES
          </Link>
        ) : null}
      </div>
    </div>
  );
}
