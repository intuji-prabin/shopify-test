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

export function ProductInfoTable({
  quantity,
  price,
  volumePrice,
  className,
  currencySymbol,
  currency,
}: {
  quantity: string;
  price: string;
  volumePrice?: any;
  className?: string;
  currency: string;
  currencySymbol: string;
}) {
  const [showAllRows, setShowAllRows] = useState(false);
  const defaultRowCount = 2;

  const handleViewMore = () => {
    setShowAllRows(!showAllRows);
  };

  const volumePriceList = showAllRows
    ? volumePrice
    : volumePrice.slice(0, defaultRowCount);

  return (
    <Table
      className={`border-[1px] border-grey-50 h-full transition-all duration-700 ease-in-out delay-200 ${className}`}
    >
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
        {volumePriceList.map((priceLIst: any) => (
          <TableRow key={priceLIst?.minQty} className="hover:bg-white">
            <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {`${priceLIst?.minQty} - ${
                priceLIst?.maxQty ? priceLIst?.maxQty : 'above'
              }`}
            </TableCell>
            <TableCell className="text-base font-medium leading-[21px] text-grey-900 text-center">
              {currency}&nbsp;{currencySymbol}
              {priceLIst?.price}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {volumePrice.length > defaultRowCount && (
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
      )}
    </Table>
  );
}
