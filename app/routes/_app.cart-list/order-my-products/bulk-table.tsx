import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Unpaid',
  },
];

export function BulkTable({
  quantity,
  price,
  product,
}: {
  quantity: string;
  price: string;
  product: any;
}) {
  return (
    <div className="flex w-full space-x-6">
      <Table className="min-w-[266px] border-[1px] border-grey-50 h-full transition-all duration-700 ease-in-out delay-200">
        <TableHeader>
          <TableRow className="bg-secondary-500 hover:bg-secondary-500">
            <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {quantity}
            </TableHead>
            <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center uppercase">
              {price}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {product.map((product: any, index: number) => (
            <TableRow key={'volumentric' + index} className="hover:bg-white">
              <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
                {product.minQty} - {product.maxQty}
              </TableCell>
              <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
                {product.price}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
