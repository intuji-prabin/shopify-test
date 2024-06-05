import { useFetcher } from '@remix-run/react';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { Routes } from '~/lib/constants/routes.constent';
import { Can } from '~/lib/helpers/Can';
import { Product } from '~/routes/_app.order_.$orderId/order-details.server';

export function OrderBreadcrumb({
  orderId,
  products,
}: {
  orderId: string;
  products: Product[];
}) {
  const fetcher = useFetcher();

  const handleReOrder = () => {
    const formData = new FormData();

    products.map((item, index) => {
      formData.append(`${item.productID + index}_productId`, item.productID);

      formData.append(
        `${item.productID + index}_variantId`,
        item.productVariantID,
      );

      formData.append(
        `${item.productID + index}_quantity`,
        item.quantity.toString(),
      );

      formData.append(`${item.productID + index}_uom`, item.uom);

      formData.append('bulkCart', 'true');

      formData.append('_action', 'add_to_cart');

      fetcher.submit(formData, { method: 'POST' });
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
      <div>
        <BackButton title="Order Details" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.ORDERS}>Order</BreadcrumbItem>
          <BreadcrumbItem className="text-grey-900">{orderId}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-lg italic font-bold leading-[22p-x]">
          {' '}
          {products.length} {products.length > 1 ? 'items' : 'item'}
        </p>
        <Can I="view" a="reorder_order">
          <Button
            variant={
              fetcher.state === 'submitting' || fetcher.state !== 'idle'
                ? 'disabled'
                : 'primary'
            }
            onClick={handleReOrder}
          >
            re-order
          </Button>
        </Can>
      </div>
    </div>
  );
}
