import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import { useEffect, useState } from 'react';
import { setFormDefaults, validationError } from 'remix-validated-form';
import { AuthError } from '~/components/ui/authError';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { RouteError } from '~/components/ui/route-error';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { Routes } from '~/lib/constants/routes.constent';
import { AllowedHTTPMethods } from '~/lib/enums/api.enum';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import {
  AllowImpersonateForm,
  ImpersonateFormFieldValidator,
} from '~/routes/_app.support_.allow-impersonate/allow-impersonate-form';
import {
  getImpersonateDetails,
  updateImpersonateStatus,
} from '~/routes/_app.support_.allow-impersonate/allow-impoersonate.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const impersonateDetails = await getImpersonateDetails(context, request, customerId);
  return json({ impersonateDetails, ...setFormDefaults('impersonate-form', impersonateDetails) });
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
        context,
      });
    case 'disallow_impersonate':
      return await updateImpersonateStatus({
        customerId,
        body,
        request,
        method: AllowedHTTPMethods.PUT,
        context
      });

    default:
      return null;
  }
}

export default function AllowImpersonatePage() {
  const { impersonateDetails } = useLoaderData<typeof loader>();

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
        <AllowImpersonateForm defaultValues={impersonateDetails} />
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
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
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
