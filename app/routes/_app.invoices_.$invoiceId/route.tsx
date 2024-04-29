import {Link} from '@remix-run/react';
import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {UploadIcon} from '~/components/icons/upload';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Button} from '~/components/ui/button';
import {PDFViewer} from '~/components/ui/pdf-viewer';
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
  const handleDownload = async (): Promise<void> => {
    // const authTokenFromLocalStorage = localStorage.getItem('authToken');
    try {
      const response = await fetch(
        'https://cigweld-middleware.intuji.com/api/v1/file_system/invoice/Inv 001976911 0005117599 76504 300 20230103 061740.pdf',
        {
          headers: {
            'x-api-key': 'kmOb3sjrtLFcXxi0RNYGJduwkG9ooPJK',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch the file. Status: ${response.status}`);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      const matches = contentDisposition?.match(/filename=(.*)/);
      const suggestedFilename = matches ? matches[1] : 'downloaded-file';

      const blob = await response.blob();

      if (blob) {
        const _url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = _url;
        //❗Removing quotes "" from the filename as Chrome also appends
        //them as &quot; in the filename
        a.download = suggestedFilename.replace(/['"]+/g, '');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(_url);
      }
    } catch (err) {
      console.error('HERE is the error', err);
    }
  };
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
