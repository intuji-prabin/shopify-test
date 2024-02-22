import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';

export default function OrderBreadcrumb({title}: {title: string}) {
  return (
    <div className="mb-4 flex flex-col gap-[6px]">
      <BackButton title="Order details " />
      <Breadcrumb>
        <BreadcrumbItem href={Routes.COMPANY_INFORMATION}>Order</BreadcrumbItem>
        <BreadcrumbItem
          href={Routes.SHIPPING_ADDRESS}
          className="text-grey-900"
        >
          {title}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
