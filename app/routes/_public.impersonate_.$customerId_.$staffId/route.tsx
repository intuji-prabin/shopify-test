import { isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { LoaderFunctionArgs, redirect } from "@remix-run/server-runtime";
import { getAccessToken } from "~/lib/utils/auth-session.server";
import { getImpersonate } from "./impersonate.server";
import { AuthError } from "~/components/ui/authError";
import { AuthErrorHandling } from "~/lib/utils/authErrorHandling";

export const loader = async ({ params, context, request }: LoaderFunctionArgs) => {
    const accessToken = await getAccessToken(context);
    if (accessToken) {
        return redirect('/');
    }
    const customerId = params?.customerId || '';
    const staffId = params?.staffId || '';
    return getImpersonate({ request, context, customerId, staffId });
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
        if(AuthErrorHandling( error.message )){ 
            return <AuthError errorMessage={error.message} />
          }
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