import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';

const PromotionHeader = () => {
  return (
    <div className="">
      <h3>Promotions</h3>
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
