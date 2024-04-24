export type Invoices = {
  id: string;
  invoiceNumber: string;
  poNumber: string;
  deliveryNumber: string;
  dispatchDetails: string;
  consignmentNumber: string;
  date: string;
};

export const dummyInvoicesData: Invoices[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    poNumber: 'PO123456',
    deliveryNumber: 'DLV-20230423',
    dispatchDetails: 'Dispatched via UPS, tracking #1234ABC',
    consignmentNumber: 'CN-987654321',
    date: '2024-04-23',
  },
  {
    id: '2',
    invoiceNumber: 'INV-001',
    poNumber: 'PO123456',
    deliveryNumber: 'DLV-20230423',
    dispatchDetails: 'Dispatched via UPS, tracking #1234ABC',
    consignmentNumber: 'CN-987654321',
    date: '2024-04-23',
  },
];
