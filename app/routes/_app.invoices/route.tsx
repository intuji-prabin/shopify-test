import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useTable } from '~/hooks/useTable';
import { Button } from '~/components/ui/button';
import { SearchInput } from '~/components/ui/search-input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { HorizontalHamburgerIcon } from '~/components/icons/hamburgerIcon';
import { Separator } from '~/components/ui/separator';
import { DataTable } from '~/components/ui/data-table';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { useColumn } from '~/routes/_app.invoices/use-column';
import { getAccessToken, isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllInvoices } from '~/routes/_app.invoices/invoices.server';
import InvoicesFilterForm from '~/routes/_app.invoices/filter-form';
import { ActionBar } from '~/routes/_app.invoices/action-bar';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { InvoiceError } from '~/routes/_app.invoices/invoice-error';
import { DEFAULT_ERRROR_MESSAGE } from '~/lib/constants/default-error-message.constants';
import { AuthError } from '~/components/ui/authError';
import { encrypt } from '~/lib/utils/cryptoUtils';

export const meta: MetaFunction = () => {
  return [{ title: 'Invoices List' }];
};

const PAGE_LIMIT = 10;

export async function loader({ request, context }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);
  const impersonateEnableCheck = await isImpersonating(request);
  const sessionAccessTocken = (await getAccessToken(context)) as string;
  const encryptedSession = encrypt(sessionAccessTocken);

  const customerId = userDetails.id;

  const { searchParams } = new URL(request.url);

  const { invoiceList, totalInvoices } = await getAllInvoices({
    context,
    request,
    customerId,
    searchParams,
  });

  return json({
    customerId,
    invoiceList,
    totalInvoices,
    encryptedSession,
    impersonateEnableCheck
  });
}

export default function InvoicesPage() {
  const { invoiceList, totalInvoices, customerId, encryptedSession, impersonateEnableCheck } =
    useLoaderData<typeof loader>();

  const { columns } = useColumn(encryptedSession, impersonateEnableCheck);

  const [searchParams] = useSearchParams();

  const { table } = useTable(columns, invoiceList, 'invoiceId');

  let isFilterApplied = false;

  for (const [key, value] of searchParams.entries()) {
    if (key === '__rvfInternalFormId' && value === 'invoice-filter-form') {
      isFilterApplied = true;
    }
  }
  const shouldRender = useConditionalRender('view_company_invoices');

  return (
    shouldRender && (
      <section className="container">
        <ActionBar table={table} customerId={customerId} sessionAccessTocken={encryptedSession} impersonateEnableCheck={impersonateEnableCheck} />
        <div className="flex flex-col gap-2 p-4 border-b bg-neutral-white sm:flex-row sm:justify-between sm:items-center">
          <div className="sm:w-[451px]">
            <SearchInput />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="relative border-grey-50">
                <HorizontalHamburgerIcon />
                Filter
                {isFilterApplied && (
                  <div className="bg-primary-500 h-3 w-3 rounded-full absolute top-0.5 right-0.5"></div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0">
              <SheetHeader className="px-4 py-6">
                <SheetTitle className="text-3xl font-bold">Filter</SheetTitle>
              </SheetHeader>
              <Separator className="" />
              <InvoicesFilterForm />
            </SheetContent>
          </Sheet>
        </div>

        <DataTable table={table} columns={columns} />

        <PaginationWrapper pageSize={PAGE_LIMIT} totalCount={totalInvoices} />
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <InvoiceError />;
  } else if (error instanceof Error) {
    if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
      return <AuthError errorMessage={error.message} />;
    }
    return <InvoiceError errorMessage={error.message} />;
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
