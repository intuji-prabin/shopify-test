import { LoaderFunctionArgs, json, redirect } from "@remix-run/server-runtime";
import { getAccessToken } from "~/lib/utils/auth-session.server";
import { getImpersonate } from "./impersonate.server";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { getUserDetailsSession, userDetailsCommitSession } from "~/lib/utils/user-session.server";
import { SESSION_MAX_AGE } from "~/lib/constants/auth.constent";
import { getMessageSession, messageCommitSession } from "~/lib/utils/toast-session.server";

export const loader = async ({ params, context, request }: LoaderFunctionArgs) => {
    const accessToken = await getAccessToken(context);
    const messageSession = await getMessageSession(request);
    const userDetailsSession = await getUserDetailsSession(request);
    if (accessToken) {
        return redirect('/');
    }
    if (params.customerId && params.staffId) {
        await getImpersonate({ context: context, customerId: params.customerId, staffId: params.staffId, userDetailsSession });
    }
    return redirect('/', {
        headers: [
            ['Set-Cookie', await context.session.commit({})],
            [
                'Set-Cookie',
                await userDetailsCommitSession(userDetailsSession, {
                    maxAge: SESSION_MAX_AGE['7_DAYS'],
                }),
            ],
            ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
    });
}

const Impersonate = () => {
    return (
        <div>
            Impersonate
        </div>
    );
}

export default Impersonate;

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
            <div className="container pt-6">
                <div className="min-h-[400px] flex justify-center items-center ">
                    <div className="flex flex-col items-center gap-2">
                        <h3>Error has occured</h3>
                        <p className="leading-[22px] text-lg text-grey uppercase font-medium text-red-500">
                            {error?.message}
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}