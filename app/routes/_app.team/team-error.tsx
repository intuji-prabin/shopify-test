import {Button} from '~/components/ui/button';
import {Routes} from '~/lib/constants/routes.constent';
import {Link} from '@remix-run/react';
import {BackButton} from '~/components/ui/back-button';
import {Can} from '~/lib/helpers/Can';
import {RouteError} from '~/components/ui/route-error';

export function TeamError({errorMessage}: {errorMessage?: string}) {
  return (
    <section className="container">
      <div className="flex items-center justify-between py-6">
        <BackButton className="capitalize" title="My Team" />
        <Can I="view" a="add_customer">
          <Link to={Routes.TEAM_ADD}>
            <Button type="button" variant="primary">
              add a team member
            </Button>
          </Link>
        </Can>
      </div>
      <RouteError errorMessage={errorMessage} />
    </section>
  );
}
