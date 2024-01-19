import {useState} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
  },
];

export function ProductInfoTable() {
  const [showAllRows, setShowAllRows] = useState(false);
  const defaultRowCount = 2;

  const handleViewMore = () => {
    setShowAllRows(!showAllRows);
  };

  const displayedInvoices = showAllRows
    ? invoices
    : invoices.slice(0, defaultRowCount);

  return (
    <Table className="min-w-[266px] border-[1px] border-grey-50 h-full">
      <TableHeader>
        <TableRow className="bg-secondary-500">
          <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center">
            Quantity
          </TableHead>
          <TableHead className="text-base font-medium leading-[21px] text-grey-900 text-center uppercase">
            Price
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayedInvoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {invoice.invoice}
            </TableCell>
            <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {invoice.paymentStatus}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={2}
            className="text-[14px] font-bold leading-6 uppercase underline decoration-primary-500 text-primary-500 italic text-center bg-white cursor-pointer"
            onClick={handleViewMore}
          >
            {showAllRows ? 'View Less' : 'View Bulk Pricing'}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
