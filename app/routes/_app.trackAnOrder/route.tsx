import { json, redirect, useActionData } from "@remix-run/react";
import { ActionFunctionArgs } from "@remix-run/server-runtime";
import { validationError } from "remix-validated-form";
import { TrackAnOrderButton, TrackAnOrderSchemaValidator } from "~/components/ui/layouts/elements/track-an-order-dialog";
import { Routes } from "~/lib/constants/routes.constent";
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from "~/lib/utils/toast-session.server";
import { getUserDetails } from "~/lib/utils/user-session.server";
import { getOrderId } from "../_app/app.server";
import { isAuthenticate } from "~/lib/utils/auth-session.server";

type ActionResponse = {
    error: string | null;
};

export async function loader({ context }: ActionFunctionArgs) {
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
    const trackAnOrderResponse = await getOrderId(trackAnOrderId, userDetails?.id);

    if (trackAnOrderResponse?.orderList.length < 1) {
        setErrorMessage(messageSession, "Order not found. Please try using correct Purchase Order Number or Order Number.");
        return json({ error: "Order not found" });
        // return redirect(Routes.ORDER_ERROR, {
        //     headers: {
        //         'Set-Cookie': await messageCommitSession(messageSession),
        //     },
        // })
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
    const data = useActionData<ActionResponse>();
    const error = data?.error || null;
    return (
        <>
            {error ? (
                <div className="container pt-12 order-error">
                    <div className="space-y-3 text-center">
                        <h1>Oops</h1>
                        <p className="text-red-500">Order not found please try again with correct Purchase Order Number or Order Number.</p>
                        <TrackAnOrderButton />
                    </div>
                </div>
            ) : (
                <div className="container pt-12 text-center">
                    <h1>Nothing found</h1>
                </div>
            )}
        </>
    );
}

export default route;