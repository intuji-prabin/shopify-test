import {Link} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {PDFViewer} from '~/components/ui/pdf-viewer';
import {useDownload} from '~/hooks/useDownload';
import {useFetch} from '~/hooks/useFetch';
import {PDF} from '~/lib/constants/pdf.constent';
import {Routes} from '~/lib/constants/routes.constent';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  return null;
}

export default function InvoiceDetailsPage() {
  const {handleDownload} = useDownload({
    url: PDF.URL,
    headers: {'x-api-key': PDF.SECRET_KEY},
  });

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
          </Breadcrumb>
        </div>
        <Button onClick={handleDownload}>
          <UploadIcon /> Export
        </Button>
      </div>
      <PDFViewer pdfURL={PDF.URL} />
    </section>
  );
}
