import {Button} from '~/components/ui/button';
import {Dialog, DialogContent, DialogTrigger} from '~/components/ui/dialog';
import {Product} from './order-details.server';
import {OrderStatusChip} from '~/components/ui/order-status-chip';

export default function ProcessingPopover({products}: {products: Product[]}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <h4 className="font-bold italic text-xs leading-4 text-gray-900 underline decoration-primary-500 decoration-2 cursor-pointer">
          View Details
        </h4>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[552px] [&>button]:-top-2 [&>button]:-right-3 [&>button]:bg-semantic-danger-500 process p-4">
        <table className="w-full border-collapse">
          <thead className="bg-secondary-500">
            <tr>
              <th
                scope="col"
                className="px-4 py-1.5 text-grey-900 font-medium text-base text-left"
              >
                iScala Line Item ID
              </th>
              <th
                scope="col"
                className="px-4 py-1.5 text-grey-900 font-medium text-base text-left"
              >
                SKU
              </th>
              <th
                scope="col"
                className="px-4 py-1.5 text-grey-900 font-medium text-base text-left"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-4 py-1.5 text-grey-900 font-medium text-base text-left"
              >
                Ordered Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-x">
                <td className="px-4 py-3 border-b">{product.itemLineNumber}</td>
                <td className="px-4 py-3 border-b">{product.sku}</td>
                <td className="px-4 py-3 border-b">{product.name}</td>
                <td className="px-4 py-3 border-b">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
