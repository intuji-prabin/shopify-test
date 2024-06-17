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
import { getAccessToken, isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { getStatementDetails } from './statement-details.server';

export const meta: MetaFunction = () => {
    return [{ title: 'Statement Detail' }];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
    await isAuthenticate(context);

    const statementId = params.statementId as string;

    const { userDetails } = await getUserDetails(request);
    const impersonateEnableCheck = await isImpersonating(request);
    const sessionAccessTocken = (await getAccessToken(context)) as string;

    const customerId = userDetails.id;

    const statementDetails = await getStatementDetails({ context, request, statementId, customerId });
    return json({ statementId, statementDetails, sessionAccessTocken, impersonateEnableCheck });
}

export default function StatementDetailsPage() {
    const { statementId, statementDetails, sessionAccessTocken, impersonateEnableCheck } = useLoaderData<typeof loader>();

    const { handleDownload } = useDownload();

    return (
        <section className="container">
            <div className="flex flex-wrap items-center justify-between gap-2 pt-6 pb-4">
                <div>
                    <BackButton title="Statement Detail" />
                    <Breadcrumb>
                        <BreadcrumbItem>Accounts</BreadcrumbItem>
                        <BreadcrumbItem href={Routes.STATEMENTS} className="text-grey-900">
                            Statement
                        </BreadcrumbItem>
                        <BreadcrumbItem className="text-grey-900">
                            {statementId}
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <Button
                    onClick={() =>
                        handleDownload({
                            url: statementDetails.files,
                            headers: {
                                apiKey: PDF.SECRET_KEY,
                                Authorization: sessionAccessTocken,
                                'Impersonate-Enable': impersonateEnableCheck,
                            },
                        })
                    }
                >
                    <UploadIcon /> Export
                </Button>
            </div>
            <PDFViewer pdfURL={statementDetails.files} />
        </section>
    );
}
