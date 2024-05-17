import { Notification_API_Credential } from "./auth.constent"

export const notificationAuthorization = ( request : Request ) => {
    const headers = request.headers
    const token  = headers.get(Notification_API_Credential?.headerKey)
    if( token === Notification_API_Credential?.headerValue ) {
        return true
    }

    throw new Error("Un-authorization access.")
}