import {OrderColumn} from './use-column';

export const dummyOrderData: OrderColumn[] = [
  {
    id: '1',
    customerPurchaseOrderNumber: 'CPON-123456',
    cigweldInternalOrderNumber: 'CIO-789012',
    orderDate: '2024-03-06',
    estimatedDeliveryDate: '2024-03-10',
    orderStatus: 'Pending',
    orderBy: 'John Doe',
  },
  {
    id: '2',
    customerPurchaseOrderNumber: 'CPON-789012',
    cigweldInternalOrderNumber: 'CIO-345678',
    orderDate: '2024-03-07',
    estimatedDeliveryDate: '2024-03-12',
    orderStatus: 'Processing',
    orderBy: 'Jane Smith',
  },
  {
    id: '3',
    customerPurchaseOrderNumber: 'CPON-345678',
    cigweldInternalOrderNumber: 'CIO-901234',
    orderDate: '2024-03-08',
    estimatedDeliveryDate: '2024-03-14',
    orderStatus: 'Shipped',
    orderBy: 'Sam Brown',
  },
];
