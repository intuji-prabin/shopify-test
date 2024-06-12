import {
    Link,
    isRouteErrorResponse,
    json,
    useLoaderData,
    useRouteError
} from '@remix-run/react';
import { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { useTable } from '~/hooks/useTable';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getAllStatements } from './statements.server';
import { useColumn } from './use-column';

export const meta: MetaFunction = () => {
    return [{ title: 'Statement List' }];
};

const PAGE_LIMIT = 10;

export async function loader({ request, context }: LoaderFunctionArgs) {
    await isAuthenticate(context);

    const { userDetails } = await getUserDetails(request);

    const customerId = userDetails.id;

    const { statementList, totalStatement } = await getAllStatements({
        context,
        request,
        customerId,
    });

    return json({
        statementList,
        totalStatement,
    });
}

export default function StatementsPage() {
    const { statementList, totalStatement } =
        useLoaderData<typeof loader>();

    const { columns } = useColumn();

    const { table } = useTable(columns, statementList, 'statementId');

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
