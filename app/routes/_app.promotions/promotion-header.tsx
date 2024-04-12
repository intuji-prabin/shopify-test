import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Routes } from '~/lib/constants/routes.constent';

const PromotionHeader = () => {
  return (
    <div className="pb-11 sm:pb-0">
      <BackButton
        className="capitalize"
        title="Promotions"
      />
      <Breadcrumb>
        <BreadcrumbItem>Content Management</BreadcrumbItem>
        <BreadcrumbItem href={Routes.PROMOTIONS} className="text-grey-900">
          Promotions
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default PromotionHeader;
