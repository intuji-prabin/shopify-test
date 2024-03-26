import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';

export default function ComparisonBreadcrumb({title}: {title: string}) {
  return (
    <>
      {' '}
      <BackButton title="Compare" />
      <Breadcrumb>
        <BreadcrumbItem href={Routes.PRODUCT}>Product</BreadcrumbItem>
        <BreadcrumbItem
          href={Routes.PRODCUT_COMPARISON}
          className="text-grey-900"
        >
          {title}
        </BreadcrumbItem>
      </Breadcrumb>
    </>
  );
}
