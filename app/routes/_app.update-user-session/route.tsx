import { Routes } from "@remix-run/react";
import { LoaderFunctionArgs, json, redirect } from "@remix-run/server-runtime";
import { SESSION_MAX_AGE } from "~/lib/constants/auth.constent";
import { setSuccessMessage, messageCommitSession } from "~/lib/utils/toast-session.server";
import { USER_DETAILS_KEY, getUserDetails, getUserDetailsSession, userDetailsCommitSession } from "~/lib/utils/user-session.server";
import { getCustomerByEmail } from "../_public.login/login.server";

export async function loader({request}: LoaderFunctionArgs) {
  const userDetailsSession = await getUserDetailsSession(request);
  // Retrieve the returnUrl from the request query parameters
  const returnUrl = new URL(request.url).searchParams.get("returnUrl");

  const {userDetails} = (await getUserDetails(request,)) as any;
  userDetailsSession.unset(USER_DETAILS_KEY);

  const customerDetails = await getCustomerByEmail({
    email: userDetails.email,
  });
  userDetailsSession.set(USER_DETAILS_KEY, customerDetails);
  
  return redirect(`${returnUrl}`, {
    headers: [
      [
        'Set-Cookie',
        await userDetailsCommitSession(userDetailsSession, {
          maxAge: SESSION_MAX_AGE['30_DAYS'],
        }),
      ],
    ],
  });
}
