import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Routes } from '~/lib/constants/routes.constent';

export default function ShippingAddressHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex flex-col gap-[6px]">
      <BackButton title="Shipping Address " />
      <Breadcrumb>
        <BreadcrumbItem href={Routes.DISTRIBUTOR_INFO}>
          Distributor Information
        </BreadcrumbItem>
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
