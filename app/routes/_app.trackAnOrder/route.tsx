import { json, redirect } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/server-runtime";
import { validationError } from "remix-validated-form";
import { TrackAnOrderButton, TrackAnOrderSchemaValidator } from "~/components/ui/layouts/elements/track-an-order-dialog";
import { Routes } from "~/lib/constants/routes.constent";
import { isAuthenticate } from "~/lib/utils/auth-session.server";
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from "~/lib/utils/toast-session.server";
import { getUserDetails } from "~/lib/utils/user-session.server";
import { getOrderId } from "../_app/app.server";

export async function loader({ context }: LoaderFunctionArgs) {
    await isAuthenticate(context);
    return null;
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const messageSession = await getMessageSession(request);
    const formData = await request.formData();

    const finalFormData = await TrackAnOrderSchemaValidator.validate(formData);
    if (finalFormData.error) {
        return validationError(finalFormData.error);
    }

    const {
        trackAnOrderId,
    } = finalFormData.data;
    const { userDetails } = await getUserDetails(request);
    const trackAnOrderResponse = await getOrderId(request, trackAnOrderId, userDetails?.id);

    if (trackAnOrderResponse?.orderList.length < 1) {
        setErrorMessage(messageSession, "Order not found. Please try using correct Purchase Order Number or Order Number.");
        return json({ error: "Order not found" });
    }
    else {
        const orderId = trackAnOrderResponse?.orderList[0]?.id;
        setSuccessMessage(messageSession, "Order found");
        return redirect(Routes.ORDERS + `/${orderId}`, {
            headers: {
                'Set-Cookie': await messageCommitSession(messageSession),
            },
        })
    }
};


const route = () => {
    return (
        <div className="container order-error min-h-[calc(100vh_-_140px)] flex justify-center items-center">
            <div className="space-y-2 text-center">
                <h3>Order number not found</h3>
                <div className="space-y-10">
                    <p className="text-lg text-grey-800">Your order number was not found.</p>
                    <TrackAnOrderButton />
                </div>
            </div>
        </div>
    );
}

export default route;