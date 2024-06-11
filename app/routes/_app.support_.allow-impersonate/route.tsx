import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import {
  AllowImpersonateForm,
  ImpersonateFormFieldValidator,
} from '~/routes/_app.support_.allow-impersonate/allow-impersonate-form';
import {
  getImpersonateStatus,
  updateImpersonateStatus,
} from '~/routes/_app.support_.allow-impersonate/allow-impoersonate.server';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { validationError } from 'remix-validated-form';
import { AllowedHTTPMethods } from '~/lib/enums/api.enum';
import { RouteError } from '~/components/ui/route-error';

export async function loader({ request, context }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const { impersonateActive } = await getImpersonateStatus(request, customerId);

  return json({ isImpersonateActive: impersonateActive });
}

export async function action({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const formData = await request.formData();

  const results = await ImpersonateFormFieldValidator.validate(formData);

  if (results.error) {
    return validationError(results.error);
  }
  const { reason } = results.data;

  const action = formData.get('_action') as
    | 'allow_impersonate'
    | 'disallow_impersonate';

  const body = JSON.stringify({ impersonateReason: reason });

  switch (action) {
    case 'allow_impersonate':
      return await updateImpersonateStatus({
        customerId,
        body,
        request,
        method: AllowedHTTPMethods.POST,
      });
    case 'disallow_impersonate':
      return await updateImpersonateStatus({
        customerId,
        body,
        request,
        method: AllowedHTTPMethods.PUT,
      });

    default:
      return null;
  }
}

export default function AllowImpersonatePage() {
  const { isImpersonateActive } = useLoaderData<typeof loader>();

  const shouldRender = useConditionalRender('allow_impersonation');

  return (
    shouldRender && (
      <section className="container">
        <div className="pt-6 pb-4 ">
          <BackButton title="Impersonate" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
            <BreadcrumbItem
              href={Routes.SUPPORT_ALLOW_IMPERSONATE}
              className="text-grey-900"
            >
              Impersonate
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <p className="my-6">
          Allow Impersonate is a collaborative effort between you and IT
          customer support to troubleshoot and resolve technical issues while
          maintaining the security and privacy of your account and data. It
          provides an efficient way to address problems without the need for
          physical presence.
        </p>
        <AllowImpersonateForm isImpersonateActive={isImpersonateActive} />
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <div className="pt-6 pb-4 ">
          <BackButton title="Impersonate" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
            <BreadcrumbItem
              href={Routes.SUPPORT_ALLOW_IMPERSONATE}
              className="text-grey-900"
            >
              Impersonate
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <RouteError />
      </section>
    );
  } else if (error instanceof Error) {
    return (
      <section className="container">
        <div className="pt-6 pb-4 ">
          <BackButton title="Impersonate" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.SUPPORT}>Support</BreadcrumbItem>
            <BreadcrumbItem
              href={Routes.SUPPORT_ALLOW_IMPERSONATE}
              className="text-grey-900"
            >
              Impersonate
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <RouteError errorMessage={error.message} />
      </section>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
