import {Link} from '@remix-run/react';
import {CircleInformationMajor} from '~/components/icons/orderStatus';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {RouteError} from '~/components/ui/route-error';
import {Routes} from '~/lib/constants/routes.constent';

import CompanyInfoHeader from '~/routes/_app.distributor-profile/company-profile-header';

export function CompanyProfileError({errorMessage}: {errorMessage?: string}) {
  return (
    <div className="container pt-6">
      <CompanyInfoHeader title="Distributor Profile Management" />
      <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3 mb-6'>
        <CircleInformationMajor />
        <AlertDescription className="text-base !translate-y-0 !pl-6">
          To edit or add new details please&nbsp;
          <Link
            to={Routes.SUPPORT_CONTACT_US}
            className="font-medium underline text-semantic-info-500 decoration-1 decoration-semantic-info-500"
          >
            contact us.
          </Link>
        </AlertDescription>
      </Alert>
      <RouteError errorMessage={errorMessage} />
    </div>
  );
}
