import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {RouteError} from '~/components/ui/route-error';
import {Routes} from '~/lib/constants/routes.constent';

export function AddTeamError({errorMessage}: {errorMessage?: string}) {
  return (
    <section className="container">
      <div className="py-6">
        <BackButton title="Add Team Member" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.TEAM}>My Team</BreadcrumbItem>
          <BreadcrumbItem href={Routes.TEAM_ADD} className="text-grey-900">
            Add Team Member
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <RouteError errorMessage={errorMessage} />
    </section>
  );
}
