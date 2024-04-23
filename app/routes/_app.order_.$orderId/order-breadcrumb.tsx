import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import { Can } from '~/lib/helpers/Can';

export function OrderBreadcrumb({orderId}: {orderId: string}) {
  return (
    <div className=" pt-6 pb-4 flex items-center justify-between">
      <div>
        <BackButton title="Order Details" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.ORDERS}>Order</BreadcrumbItem>
          <BreadcrumbItem className="text-grey-900">{orderId}</BreadcrumbItem>
        </Breadcrumb>
      </div>

      <div className="flex gap-2 items-center">
        <p className="text-lg italic font-bold leading-[22p-x]">6 items</p>
        <Can I="view" a="reorder_order">
        <Button variant="primary">re-order</Button>
        </Can>

      </div>
    </div>
  );
}
