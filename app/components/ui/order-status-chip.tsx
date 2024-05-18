import {OrderStatus} from '~/routes/_app.order/order.server';
import {statusVariants} from '~/components/ui/status';

/**
 * Component to display Order Status
 * @param {OrderStatus} status - Order Status Type
 * @returns {JSX.Element} - Order Status
 */

export function OrderStatusChip({status}: {status: OrderStatus}) {
  switch (status) {
    case 'received':
      return (
        <div className={statusVariants({variant: 'received'})}>Received</div>
      );
    case 'order_cancel':
      return (
        <div className={statusVariants({variant: 'closed'})}>Order Cancel</div>
      );
    case 'on_hold':
      return (
        <div className={statusVariants({variant: 'pending'})}>On Hold</div>
      );
    case 'processing':
      return (
        <div className={statusVariants({variant: 'awaiting'})}>Processing</div>
      );
    case 'order_picked':
      return (
        <div className={statusVariants({variant: 'awaiting'})}>
          Order Picked
        </div>
      );
    case 'dispatched':
      return (
        <div className={statusVariants({variant: 'shipped'})}>Dispatched</div>
      );
    case 'invoice_billing':
      return (
        <div className={statusVariants({variant: 'invoice'})}>
          Invoice Billing
        </div>
      );
    case 'in_transit':
      return (
        <div className={statusVariants({variant: 'partially_shipped'})}>
          In Transit
        </div>
      );
    case 'delivered':
      return (
        <div className={statusVariants({variant: 'shipped'})}>Delivered</div>
      );
    default:
      return 'N/A';
  }
}
