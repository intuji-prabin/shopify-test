import {Button} from '~/components/ui/button';
import {BackButton} from '~/components/ui/back-button';
import {Routes} from '~/lib/constants/routes.constent';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Link} from '@remix-run/react';
import {Can} from '~/lib/helpers/Can';
import {RouteError} from '~/components/ui/route-error';

export function TicketError({errorMessage}: {errorMessage?: string}) {
  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex items-center justify-between">
        <div>
          <BackButton title="Tickets History" />
          <Breadcrumb>
            <BreadcrumbItem href="/support">Support</BreadcrumbItem>
            <BreadcrumbItem href="/support/tickets" className="text-grey-900">
              Tickets
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Can I="view" a="open_ticket">
          <Link to={Routes.SUPPORT_TICKETS_CREATE}>
            <Button>Open A Ticket</Button>
          </Link>
        </Can>
      </div>
      <RouteError errorMessage={errorMessage} />
    </section>
  );
}
