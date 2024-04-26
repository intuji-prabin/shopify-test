import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {PDFViewer} from '~/components/ui/pdf-viewer';
import {useFetch} from '~/hooks/useFetch';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

export async function loader({context, params, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const results = await useFetch({
    url: 'https://cig-backend.webo.dev/api/invoice/001976911',
  });
  console.log('resulst', results);

  return null;
}

export default function InvoiceDetailsPage() {
  return (
    <>
      <h1> Invoices Details page</h1>;
      <PDFViewer />
    </>
  );
}
