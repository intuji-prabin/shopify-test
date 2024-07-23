import { useTable } from '~/hooks/useTable';
import { Button } from '~/components/ui/button';
import { Separator } from '~/components/ui/separator';
import { DataTable } from '~/components/ui/data-table';
import { BackButton } from '~/components/ui/back-button';
import { Routes } from '~/lib/constants/routes.constent';
import { SearchInput } from '~/components/ui/search-input';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { useColumn } from '~/routes/_app.support_.tickets/use-column';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { HorizontalHamburgerIcon } from '~/components/icons/hamburgerIcon';
import TicketsFilterForm from '~/routes/_app.support_.tickets/filter-form';
import { LoaderFunctionArgs, MetaFunction, json } from '@shopify/remix-oxygen';
import { getAllTickets } from '~/routes/_app.support_.tickets/support-tickets.server';
import { getSupportContact } from '~/routes/_app.support_.contact-us/support-contact-us.server';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSearchParams,
} from '@remix-run/react';
import { Can } from '~/lib/helpers/Can';
import { useConditionalRender } from '~/hooks/useAuthorization';
import { TicketError } from '~/routes/_app.support_.tickets/ticket-error';
import { AuthError } from '~/components/ui/authError';
import { AuthErrorHandling } from '~/lib/utils/authErrorHandling';

export const meta: MetaFunction = () => {
  return [{ title: 'Ticket List' }];
};

const PAGE_LIMIT = 8;

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const { searchParams } = new URL(request.url);

  const { totalCount, tickets } = await getAllTickets({
    context,
    request,
    customerId,
    searchParams,
  });

  const supportContact = await getSupportContact({ context });

  const departmentOptions = supportContact.map((item) => ({
    title: item.department,
    value: item.id.split('/').pop() as string,
  }));

  return json({ totalCount, tickets, departmentOptions });
}

export default function TicketsPage() {
  const { tickets, totalCount, departmentOptions } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const { columns } = useColumn();

  const { table } = useTable(columns, tickets);

  let isFilterApplied = false;

  for (const [key, value] of searchParams.entries()) {
    if (key === '__rvfInternalFormId' && value === 'tickets-filter-form') {
      isFilterApplied = true;
    }
  }
  const shouldRender = useConditionalRender('ticket_operations');

  return (
    shouldRender && (
      <section className="container">
        <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
          <div>
            <BackButton title="Tickets History" />
            <Breadcrumb>
              <BreadcrumbItem href="/support">Support</BreadcrumbItem>
              <BreadcrumbItem href="/support/tickets" className="text-grey-900">
                Tickets
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <Can I="view" a="open_ticket">
            <Link to={Routes.SUPPORT_TICKETS_CREATE}>
              <Button>Open A Ticket</Button>
            </Link>
          </Can>
        </div>
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
              <TicketsFilterForm options={departmentOptions} />
            </SheetContent>
          </Sheet>
        </div>
        <DataTable table={table} columns={columns} />

        <PaginationWrapper pageSize={PAGE_LIMIT} totalCount={totalCount} />
      </section>
    )
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <TicketError />;
  } else if (error instanceof Error) {
    if(AuthErrorHandling( error.message )){ 
      return <AuthError errorMessage={error.message} />
    }
    return <TicketError errorMessage={error.message} />;
  } else {
    return <h1>Unknown Error</h1>;
  }
}
