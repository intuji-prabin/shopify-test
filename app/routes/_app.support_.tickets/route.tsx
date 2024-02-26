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
import TicketsFilterForm from '~/routes/_app.support_.tickets/filter-form';
import {LoaderFunctionArgs, MetaFunction, json} from '@shopify/remix-oxygen';
import {getAllTickets} from '~/routes/_app.support_.tickets/support-tickets';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';
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
} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{title: 'Ticket List'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const {totalCount, tickets} = await getAllTickets({customerId, request});

  const roles = await getCustomerRolePermission(context);

  return json({totalCount, tickets, roles});
}

export default function TicketsPage() {
  const {tickets, totalCount, roles} = useLoaderData<typeof loader>();

  const {columns} = useColumn();

  const {table} = useTable(columns, tickets);

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
            <TicketsFilterForm options={roles.data} />
          </SheetContent>
        </Sheet>
      </div>
      <DataTable table={table} columns={columns} />
      <div className="bg-neutral-white py-4 px-6 border-t flex items-center justify-between">
        <p className="w-40 text-grey-400 font-medium">
          1-7 of {totalCount} Items
        </p>
        <PaginationWrapper pageSize={5} totalCount={totalCount} />
      </div>
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
