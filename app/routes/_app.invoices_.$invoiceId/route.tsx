import { MetaFunction, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { UploadIcon } from '~/components/icons/upload';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { PDFViewer } from '~/components/ui/pdf-viewer';
import { useDownload } from '~/hooks/useDownload';
import { PDF } from '~/lib/constants/pdf.constent';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getInvoiceDetails } from '~/routes/_app.invoices_.$invoiceId/invoices-detatils.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Invoices Detail' }];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const invoiceId = params.invoiceId as string;

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id;

  const invoiceDetails = await getInvoiceDetails({ invoiceId, customerId });

  return json({ invoiceId, invoiceDetails });
}

export default function InvoiceDetailsPage() {
  const { invoiceId, invoiceDetails } = useLoaderData<typeof loader>();

  const { handleDownload } = useDownload();

  return (
    <section className="container">
      <div className="flex items-center justify-between pt-6 pb-4 ">
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
          onClick={() =>
            handleDownload({
              url: invoiceDetails.files,
              headers: { apiKey: PDF.SECRET_KEY },
            })
          }
        >
          <UploadIcon /> Export
        </Button>
      </div>
      <PDFViewer pdfURL={invoiceDetails.files} />
    </section>
  );
}
