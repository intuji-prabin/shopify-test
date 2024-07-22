import { redirect } from "@remix-run/server-runtime";

export const AuthErrorHandling = ( error : string ) => {
    if (error.includes("Un-Authorize access") || error.includes("Impersonation already deactivate")) {
        return true;
    }
    else if (error.includes("You do not have permission to access this api")) {
        redirect('/');
    }
    return false;
}