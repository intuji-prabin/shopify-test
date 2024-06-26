import {
    Link,
    isRouteErrorResponse,
    json,
    useLoaderData,
    useRouteError,
    useSearchParams
} from '@remix-run/react';
import { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { useTable } from '~/hooks/useTable';
import { Routes } from '~/lib/constants/routes.constent';
import { getAccessToken, isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllStatements } from './statements.server';
import { useColumn } from './use-column';
import { AuthError } from '~/components/ui/authError';
import { encrypt } from '~/lib/utils/cryptoUtils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet';
import { HorizontalHamburgerIcon } from '~/components/icons/hamburgerIcon';
import { Separator } from '~/components/ui/separator';
import StatementsFilterForm from './filter-form';

export const meta: MetaFunction = () => {
    return [{ title: 'Statement List' }];
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

    const { statementList, totalStatement } = await getAllStatements({
        context,
        request,
        customerId,
        searchParams
    });

    return json({
        statementList,
        totalStatement,
        encryptedSession,
        impersonateEnableCheck
    });
}

export default function StatementsPage() {
    const { statementList, totalStatement, encryptedSession, impersonateEnableCheck } =
        useLoaderData<typeof loader>();

    const [searchParams] = useSearchParams();

    const { columns } = useColumn(encryptedSession, impersonateEnableCheck);

    const { table } = useTable(columns, statementList, 'statementId');

    let isFilterApplied = false;

    for (const [key, value] of searchParams.entries()) {
        if (key === '__rvfInternalFormId' && value === 'statement-filter-form') {
            isFilterApplied = true;
        }
    }

    return (
        <section className="container">
            <div className='pt-6 pb-4'>
                <BackButton title="Statements" />
                <Breadcrumb>
                    <BreadcrumbItem>Accounts</BreadcrumbItem>
                    <BreadcrumbItem href={Routes.STATEMENTS} className="text-grey-900">
                        Statements
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>

            <div className="flex flex-col gap-2 p-4 border-b bg-neutral-white sm:flex-row sm:justify-between sm:items-center">
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
                        <StatementsFilterForm />
                    </SheetContent>
                </Sheet>
            </div>

            <DataTable table={table} columns={columns} />

            <PaginationWrapper pageSize={PAGE_LIMIT} totalCount={totalStatement} />
        </section>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <div className="container order-error min-h-[calc(100vh_-_140px)] flex justify-center items-center">
                <div className="space-y-2 text-center">
                    <h3>{error.status} {error.statusText}</h3>
                    <div className="space-y-5">
                        <p className="text-lg text-grey-800">{error.data}</p>
                        <Button className='mx-auto'>
                            <Link to={Routes.STATEMENTS}>Got back to statements</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else if (error instanceof Error) {
        if (error.message.includes("Un-Authorize access") || error.message.includes("Impersonation already deactivate")) {
            return <AuthError errorMessage={error.message} />;
        }
        return (
            <div className="container order-error min-h-[calc(100vh_-_140px)] flex justify-center items-center">
                <div className="space-y-2 text-center">
                    <h3>Something went wrong</h3>
                    <div className="space-y-5">
                        <p className="text-lg text-grey-800">{error.message}</p>
                        <Button className='mx-auto'>
                            <Link to={Routes.STATEMENTS}>Got back to statements</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
