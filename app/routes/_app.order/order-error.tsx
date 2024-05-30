import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {RouteError} from '~/components/ui/route-error';
import {Routes} from '~/lib/constants/routes.constent';

export function OrderError({errorMessage}: {errorMessage?: string}) {
  return (
    <section className="container">
      <div className="pt-6 pb-4 ">
        <BackButton title="Orders" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.ORDERS} className="text-grey-900">
            Orders
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <RouteError errorMessage={errorMessage} />;
    </section>
  );
}
