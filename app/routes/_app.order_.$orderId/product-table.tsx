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
    `${orderProductDetails.currency} ${
      orderProductDetails.currencySymbol
    }${parseFloat(price).toFixed(2)}`;

  const {columns} = useColumn({prefixWithCurrency});

  const {table} = useTable(columns, orderProductDetails.products);

  const {columns: shippedProductColumns} = useColumn({
    prefixWithCurrency,
    isShippedProduct: true,
  });

  const {table: shippedProductTable} = useTable(
    columns,
    orderProductDetails.shippedProduct,
  );

  return (
    <>
      <div className="p-2 mt-6 bg-white">
        <h4 className="px-4 not-italic">Total Products</h4>
        <DataTable table={table} columns={columns} />
        <Separator />
        <div className="flex flex-wrap gap-3 px-4 py-6 lg:justify-end">
          <Can I="view" a="view_tracked_order_price">
            <table className="border-spacing-x-3.5 border-separate">
              <tbody>
                <tr>
                  <th className="text-left">Subtotal</th>
                  <td>
                    {prefixWithCurrency(orderProductDetails.productSubTotal)}
                  </td>
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
                  <th className="text-left">Discount</th>
                  <td>{prefixWithCurrency(orderProductDetails.discount)}</td>
                </tr>
                <tr>
                  <th className="text-left"> Total Excl GST</th>
                  <td>
                    {prefixWithCurrency(
                      orderProductDetails.productSubTotalExclGST,
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">GST</th>
                  <td>{prefixWithCurrency(orderProductDetails.productGST)}</td>
                </tr>
                <tr className="leading-7.5 text-[22px]">
                  <th className="text-left">Total</th>
                  <td className="font-bold text-primary-500">
                    {prefixWithCurrency(orderProductDetails.productTotalPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Can>
        </div>
      </div>
      <div className="p-2 mt-6 bg-white">
        <h4 className="px-4 not-italic">Shipped Products</h4>
        <DataTable
          table={shippedProductTable}
          columns={shippedProductColumns}
        />
        <Separator />
        <div className="flex flex-wrap justify-between gap-3 px-4 py-6">
          <article className="p-4 space-y-2 border bg-primary-50 border-grey-50">
            <h5>What’s next?</h5>
            <p className="font-medium text-grey-900">
              You product will be delivered on following steps.
            </p>
            <p className="font-medium text-grey-900">
              Received {'>'} Processing {'>'} Order Picked {'>'} Dispatched{' '}
              {'>'} Invoice Billing {'>'} In Transit {'>'} Delivered
            </p>
          </article>
          <Can I="view" a="view_tracked_order_price">
            <table className="border-spacing-x-3.5 border-separate">
              <tbody>
                <tr>
                  <th className="text-left">Subtotal</th>
                  <td>
                    {prefixWithCurrency(orderProductDetails.shippedSubTotal)}
                  </td>
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
                  <th className="text-left">Discount</th>
                  <td>{prefixWithCurrency(orderProductDetails.discount)}</td>
                </tr>
                <tr>
                  <th className="text-left"> Total Excl GST</th>
                  <td>
                    {prefixWithCurrency(
                      orderProductDetails.shippedSubTotalExclGST,
                    )}
                  </td>
                </tr>
                <tr>
                  <th className="text-left">GST</th>
                  <td>{prefixWithCurrency(orderProductDetails.shippedGST)}</td>
                </tr>
                <tr className="leading-7.5 text-[22px]">
                  <th className="text-left">Total</th>
                  <td className="font-bold text-primary-500">
                    {prefixWithCurrency(orderProductDetails.shippedPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </Can>
        </div>
      </div>
    </>
  );
}
