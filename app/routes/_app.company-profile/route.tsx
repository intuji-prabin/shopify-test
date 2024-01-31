import { CircleInformationMajor } from '~/components/icons/orderStatus';
import CompanyProfileDetail from './company-profile-detail';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Link, isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { Routes } from '~/lib/constants/routes.constent';
import { getAllCompanyProfileDetails } from './company-profile.server';
import CompanyInfoHeader from './company-profile-header';

export async function loader() {
  const response = await getAllCompanyProfileDetails("abc123");
  if (response.data.companies.nodes.length === 0) {
    throw new Response("Oh no! Something went wrong!", {
      status: 404,
    });
  } else {
    const results = response?.data;
    return json({ results });
  }
}

export default function Company_Profile_Management() {
  const { results } = useLoaderData<typeof loader>();
  return (
    <div className="container py-12 bg-primary-25">
      <CompanyInfoHeader title='Company Profile Management' />
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
      <section className='container'>
        <h1 className='text-center uppercase'>No data found</h1>
      </section>
    )
  }
}