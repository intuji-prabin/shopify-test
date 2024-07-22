import { badgeVariants } from '~/components/ui/badge';
import { StockStatus } from '~/routes/_app.cart-list/order-my-products/use-column';

/**
 * Component to display Stock Status Chip
 * @param {StockStatus} status - Stock Status Type
 * @returns {JSX.Element} - Stock Status
 */

export function StockStatusChip({ status }: { status: StockStatus }) {
  switch (status) {
    case 'In Stock':
      return (
        <div className={`${badgeVariants({ variant: 'inStock' })} !m-0 `}>
          <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>IN
          STOCK
        </div>
      );
    case 'Low Stock':
      return (
        <div className={`${badgeVariants({ variant: 'lowStock' })} !m-0 `}>
          <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span>LOW
          STOCK
        </div>
      );
    case 'Out of Stock':
      return (
        <div className={`${badgeVariants({ variant: 'outOfStock' })} !m-0 `}>
          <span className="w-2 h-2 mr-1.5 bg-current rounded-full"></span> OUT
          OF STOCK
        </div>
      );
    default:
      return 'N/A';
  }
}
