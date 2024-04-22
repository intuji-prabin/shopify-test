import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { getAccessToken, isAuthenticate } from "~/lib/utils/auth-session.server";
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from "~/lib/utils/toast-session.server";
import { productBulkCart } from "../_app.categories/bulkOrder.server";
import { json } from "@remix-run/react";

export async function loader({ context }: LoaderFunctionArgs) {
    await isAuthenticate(context);
    return null;
}

export const action = async ({
    request,
    context,
}: ActionFunctionArgs) => {
    const accessTocken = (await getAccessToken(context)) as string;
    const messageSession = await getMessageSession(request);
    const contentType = request.headers.get('Content-Type');
    if (contentType === 'application/json') {
        const jsonPayload = (await request.json()) as { stockCode: string; quantity: number; uom: string }[];
        try {
            await productBulkCart(jsonPayload, context, accessTocken, request);
            setSuccessMessage(messageSession, 'Item added to cart successfully');
            return json(
                {},
                {
                    headers: [
                        ['Set-Cookie', await context.session.commit({})],
                        ['Set-Cookie', await messageCommitSession(messageSession)],
                    ],
                },
            );
        } catch (error) {
            if (error instanceof Error) {
                console.log('this is err', error?.message);
                setErrorMessage(messageSession, error?.message);
                return json(
                    {},
                    {
                        headers: [
                            ['Set-Cookie', await context.session.commit({})],
                            ['Set-Cookie', await messageCommitSession(messageSession)],
                        ],
                    },
                );
            }
            setErrorMessage(
                messageSession,
                'Item not added to cart. Please try again later.',
            );
            return json(
                {},
                {
                    headers: [
                        ['Set-Cookie', await context.session.commit({})],
                        ['Set-Cookie', await messageCommitSession(messageSession)],
                    ],
                },
            );
        }
    }
};

const route = () => {
    return (
        <div>
            Bulk Order Page
        </div>
    );
}

export default route;