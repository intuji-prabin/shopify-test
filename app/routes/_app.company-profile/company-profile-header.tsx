import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Routes } from '~/lib/constants/routes.constent';

export default function CompanyInfoHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex flex-col gap-[6px]">
      <BackButton title="Company Profile Management" />
      <Breadcrumb>
        <BreadcrumbItem href={Routes.COMPANY_INFORMATION}>
          Company Information
        </BreadcrumbItem>
        <BreadcrumbItem href={Routes.COMPANY_PROFILE} className="text-grey-900">
          {title}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
}
