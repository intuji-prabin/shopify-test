import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {CircleInformationMajor} from '~/components/icons/orderStatus';
import {Alert, AlertDescription} from '~/components/ui/alert';
import {Routes} from '~/lib/constants/routes.constent';
import {getUserDetails} from '~/lib/utils/authsession.server';
import CompanyProfileDetail from './company-profile-detail';
import CompanyInfoHeader from './company-profile-header';
import {getAllCompanyProfileDetails} from './company-profile.server';

export async function loader({context}: LoaderFunctionArgs) {
  const {userDetails} = await getUserDetails(context);
  const companyId = userDetails.meta.company_id.value;

  const response = await getAllCompanyProfileDetails(companyId);
  if (response) {
    return json(response);
  }
  return null;
}

export default function Company_Profile_Management() {
  const results = useLoaderData<typeof loader>();
  return (
    <div className="container py-12 bg-primary-25">
      <CompanyInfoHeader title="Company Profile Management" />
      <Alert className='border-0 rounded-none bg-semantic-info-100 before:content-[""] before:bg-semantic-info-500 before:inline-block before:h-full before:absolute before:w-1 before:left-0 before:top-0 py-2.5 [&>svg]:top-1/2 [&>svg]:-translate-y-1/2 [&>svg]:left-3 mb-6'>
        <CircleInformationMajor />
        <AlertDescription className="text-base !translate-y-0 !pl-6">
          To edit or add new shipping address please&nbsp;
          <Link
            to={Routes.SUPPORT_CONTACT_US}
            className="font-medium underline text-semantic-info-500 decoration-1 decoration-semantic-info-500"
          >
            contact us.
          </Link>
        </AlertDescription>
      </Alert>
      <CompanyProfileDetail data={results} />
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <h1 className="text-center uppercase">No data found</h1>
      </section>
    );
  }
}
