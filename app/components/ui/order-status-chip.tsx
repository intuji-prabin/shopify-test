import {OrderStatus} from '~/routes/_app.order/order.server';
import {statusVariants} from '~/components/ui/status';

/**
 * Component to display Order Status
 * @param {OrderStatus} status - Order Status Type
 * @returns {JSX.Element} - Order Status
 */

export function OrderStatusChip({status}: {status: OrderStatus}) {
  switch (status) {
    case 'Received Shopify Order':
      return (
        <div className={statusVariants({variant: 'received'})}>Received</div>
      );
    case 'Order Cancel':
      return (
        <div className={statusVariants({variant: 'closed'})}>Order Cancel</div>
      );
    case 'On Hold':
      return (
        <div className={statusVariants({variant: 'pending'})}>On Hold</div>
      );
    case 'Processing':
      return (
        <div className={statusVariants({variant: 'awaiting'})}>Processing</div>
      );
    case 'Order Picked':
      return (
        <div className={statusVariants({variant: 'awaiting'})}>
          Order Picked
        </div>
      );
    case 'Dispatched':
      return (
        <div className={statusVariants({variant: 'shipped'})}>Dispatched</div>
      );
    case 'Invoice Billing':
      return (
        <div className={statusVariants({variant: 'invoice'})}>
          Invoice Billing
        </div>
      );
    case 'InTransit':
      return (
        <div className={statusVariants({variant: 'partially_shipped'})}>
          In Transit
        </div>
      );
    case 'Delivered':
      return (
        <div className={statusVariants({variant: 'shipped'})}>Delivered</div>
      );
    default:
      return 'N/A';
  }
}
