import {useTable} from '~/hooks/useTable';
import {Button} from '~/components/ui/button';
import {Separator} from '~/components/ui/separator';
import {DataTable} from '~/components/ui/data-table';
import {BackButton} from '~/components/ui/back-button';
import {Routes} from '~/lib/constants/routes.constent';
import {SearchInput} from '~/components/ui/search-input';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {useColumn} from '~/routes/_app.support_.tickets/use-column';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {HorizontalHamburgerIcon} from '~/components/icons/hamburgerIcon';
import TicketsFilterForm, {
  TicketsFilterFormType,
} from '~/routes/_app.support_.tickets/filter-form';
import {LoaderFunctionArgs, MetaFunction, json} from '@shopify/remix-oxygen';
import {getAllTickets} from '~/routes/_app.support_.tickets/support-tickets';
import {getSupportContact} from '~/routes/_app.support_.contact-us/support-contact-us.server';
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

export const meta: MetaFunction = () => {
  return [{title: 'Ticket List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const {totalCount, tickets} = await getAllTickets({customerId, request});

  const supportContact = await getSupportContact({context});

  const departmentOptions = supportContact.map((item) => ({
    title: item.department,
    value: item.id.split('/').pop() as string,
  }));

  return json({totalCount, tickets, departmentOptions});
}

export default function TicketsPage() {
  const {tickets, totalCount, departmentOptions} =
    useLoaderData<typeof loader>();

  const {columns} = useColumn();

  const {table} = useTable(columns, tickets);

  const [searchParams] = useSearchParams();

  const defaultValues: TicketsFilterFormType = {};

  defaultValues.status = searchParams.get('status') || undefined;
  // defaultValues.createdDateFrom = searchParams.get('createdDateFrom') || '';
  // defaultValues.createdDateTo = searchParams.get('createdDateTo') || '';
  defaultValues.departmentId = searchParams.get('departmentId') || '';
  console.log('defaultValues', defaultValues);

  return (
    <section className="container">
      <div className=" pt-6 pb-4 flex items-center justify-between">
        <div>
          <BackButton title="Tickets History" />
          <Breadcrumb>
            <BreadcrumbItem href="/support">Support</BreadcrumbItem>
            <BreadcrumbItem href="/support/tickets" className="text-grey-900">
              Tickets
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <Link to={Routes.SUPPORT_TICKETS_CREATE}>
          <Button>Open A Ticket</Button>
        </Link>
      </div>
      <div className="flex items-center justify-between bg-neutral-white p-6 border-b">
        <div className="w-[451px]">
          <SearchInput />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="border-grey-50">
              <HorizontalHamburgerIcon />
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="p-0">
            <SheetHeader className="px-4 py-6">
              <SheetTitle className="text-3xl font-bold">Filter</SheetTitle>
            </SheetHeader>
            <Separator className="" />
            <TicketsFilterForm
              options={departmentOptions}
              defaultValues={defaultValues}
            />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable table={table} columns={columns} />

      <PaginationWrapper pageSize={3} totalCount={totalCount} />
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
