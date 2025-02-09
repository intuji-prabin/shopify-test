import {
  MetaFunction,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {UploadIcon} from '~/components/icons/upload';
import {AuthError} from '~/components/ui/authError';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import {PDFViewer} from '~/components/ui/pdf-viewer';
import {useDownload} from '~/hooks/useDownload';
import {PDF} from '~/lib/constants/pdf.constent';
import {Routes} from '~/lib/constants/routes.constent';
import {
  getAccessToken,
  isAuthenticate,
  isImpersonating,
} from '~/lib/utils/auth-session.server';
import {AuthErrorHandling} from '~/lib/utils/authErrorHandling';
import {encrypt} from '~/lib/utils/cryptoUtils';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getInvoiceDetails} from '~/routes/_app.invoices_.$invoiceId/invoices-detatils.server';

export const meta: MetaFunction = () => {
  return [{title: 'Invoices Detail'}];
};

export async function loader({context, params, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const invoiceId = params.invoiceId as string;

  const {userDetails} = await getUserDetails(request);
  const impersonateEnableCheck = await isImpersonating(request);
  const sessionAccessTocken = (await getAccessToken(context)) as string;
  const encryptedSession = encrypt(sessionAccessTocken);

  const customerId = userDetails.id;

  const invoiceDetails = await getInvoiceDetails({
    context,
    request,
    invoiceId,
    customerId,
  });

  return json({
    invoiceId,
    invoiceDetails,
    encryptedSession,
    impersonateEnableCheck,
  });
}

export default function InvoiceDetailsPage() {
  const {invoiceId, invoiceDetails, encryptedSession, impersonateEnableCheck} =
    useLoaderData<typeof loader>();

  const {handleDownload, loading} = useDownload();

  return (
    <section className="container">
      <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
        <div>
          <BackButton title="Invoice Detail" />
          <Breadcrumb>
            <BreadcrumbItem>Accounts</BreadcrumbItem>
            <BreadcrumbItem href={Routes.INVOICES} className="text-grey-900">
              Invoices
            </BreadcrumbItem>
            <BreadcrumbItem className="text-grey-900">
              {invoiceId}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Button
          className={`${loading && 'pointer-events-none'}`}
          onClick={() =>
            handleDownload({
              url: invoiceDetails.files,
              headers: {
                apiKey: PDF.SECRET_KEY,
                Authorization: encryptedSession,
                'Impersonate-Enable': impersonateEnableCheck,
              },
            })
          }
        >
          {loading ? <Loader /> : <UploadIcon />} Export
        </Button>
      </div>
      <PDFViewer pdfURL={invoiceDetails.files} />
    </section>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    if (AuthErrorHandling(error.message)) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
