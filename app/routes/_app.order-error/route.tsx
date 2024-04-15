import { ActionFunctionArgs } from "@remix-run/server-runtime";
import { TrackAnOrderButton } from "~/components/ui/layouts/elements/track-an-order-dialog";
import { isAuthenticate } from "~/lib/utils/auth-session.server";

export async function loader({ context }: ActionFunctionArgs) {
    await isAuthenticate(context);
    return null;
}

const route = () => {
    return (
        <div className="container pt-12 order-error">
            <div className="space-y-3 text-center">
                <h1>Oops</h1>
                <p className="text-red-500">Nothing found please try again with correct Purchase Order Number or Order Number.</p>
                <TrackAnOrderButton />
            </div>
        </div>
    );
}

export default route;