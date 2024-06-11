import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { MetaFunction } from '@shopify/remix-oxygen';
import { CircleInformationMajor } from '~/components/icons/orderStatus';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllCompanyProfileDetails } from '~/routes/_app.distributor-profile/company-profile.server';
import CompanyInfoHeader from './company-profile-header';
import CompanyProfileDetail from '~/routes/_app.distributor-profile/company-profile-detail';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { DEFAULT_ERRROR_MESSAGE } from '~/lib/constants/default-error-message.constants';
import { CompanyProfileError } from '~/routes/_app.distributor-profile/company-profile-error';

export const meta: MetaFunction = () => {
  return [{ title: 'Company Profile' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);

  const userId = userDetails.id.split('/').pop() as string;

  const companyProfileDetails = await getAllCompanyProfileDetails({
    context,
    request,
    userId,
  });

  return json({ companyProfileDetails });
}

export default function CompanyProfileManagementPage() {
  const { companyProfileDetails } = useLoaderData<typeof loader>();
  const shouldRender = useConditionalRender('view_company_information');

  return (
    shouldRender && (
      <div className="container pt-6 bg-primary-25">
        <CompanyInfoHeader title="Distributor Profile" />
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
        <CompanyProfileDetail companyProfileDetails={companyProfileDetails} />
      </div>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <CompanyProfileError />;
  } else if (error instanceof Error) {
    return <CompanyProfileError errorMessage={error.message} />;
  } else {
    return (
      <h1 className="text-semantic-danger-100">{DEFAULT_ERRROR_MESSAGE}</h1>
    );
  }
}
