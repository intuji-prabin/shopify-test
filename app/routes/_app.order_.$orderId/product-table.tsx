import {useTable} from '~/hooks/useTable';
import {OrderDetails} from '~/routes/_app.order_.$orderId/order-details.server';
import {useColumn} from '~/routes/_app.order_.$orderId/use-column';
import {DataTable} from '~/components/ui/data-table';
import {Separator} from '~/components/ui/separator';
import {Can} from '~/lib/helpers/Can';

export function ProductTable({
  orderProductDetails,
}: {
  orderProductDetails: OrderDetails;
}) {
  const prefixWithCurrency = (price: string) =>
    `${orderProductDetails.currency} ${price}`;

  const {columns} = useColumn({prefixWithCurrency});

  const {table} = useTable(columns, orderProductDetails.products);

  return (
    <div className="bg-white p-2 mt-6">
      <DataTable table={table} columns={columns} />
      <Separator />
      <div className="flex justify-between px-4 py-6">
        <article className="space-y-2 bg-primary-50 p-4 border-grey-50 border">
          <h5>What’s next?</h5>
          <p className="text-grey-900 font-medium">
            You product will be delivered on following steps.
          </p>
          <p className="text-grey-900 font-medium">
            Received {'>'} Processing {'>'} Order Picked {'>'} Dispatched {'>'}{' '}
            Invoice Billing {'>'} In Transit {'>'} Delivered
          </p>
        </article>
        <Can I="view" a="view_tracked_order_price">
          <table className="w-48">
            <tbody>
              <tr>
                <th className="text-left">Subtotal</th>
                <td>{prefixWithCurrency(orderProductDetails.subTotal)}</td>
              </tr>
              <tr>
                <th className="text-left">Freight</th>
                <td>{prefixWithCurrency(orderProductDetails.freight)}</td>
              </tr>
              <tr>
                <th className="text-left">Surcharges</th>
                <td>{prefixWithCurrency(orderProductDetails.surCharges)}</td>
              </tr>
              <tr>
                <th className="text-left"> Total Excl GST</th>
                <td>{prefixWithCurrency(orderProductDetails.totalExclGst)}</td>
              </tr>
              <tr>
                <th className="text-left">GST</th>
                <td>{prefixWithCurrency(orderProductDetails.gst)}</td>
              </tr>
              <tr>
                <th className="text-left">Discount</th>
                <td>{prefixWithCurrency(orderProductDetails.discount)}</td>
              </tr>
              <tr className="leading-7.5 text-[22px]">
                <th className="text-left">Total</th>
                <td className="font-bold text-primary-500">
                  {prefixWithCurrency(orderProductDetails.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </Can>
      </div>
    </div>
  );
}
