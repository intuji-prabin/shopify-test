import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {RouteError} from '~/components/ui/route-error';
import {Routes} from '~/lib/constants/routes.constent';

export function InvoiceError({errorMessage}: {errorMessage?: string}) {
  return (
    <section className="container">
      <div className="pt-6 pb-4 ">
        <BackButton title="Orders" />
        <Breadcrumb>
          <BreadcrumbItem>Accounts</BreadcrumbItem>
          <BreadcrumbItem href={Routes.INVOICES} className="text-grey-900">
            Invoices
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <RouteError errorMessage={errorMessage} />;
    </section>
  );
}
