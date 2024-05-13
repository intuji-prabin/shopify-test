import { Permission_API_Credential } from "./auth.constent"

export const permissionAuthorization = ( request : Request ) => {
    const headers = request.headers
    const token  = headers.get(Permission_API_Credential?.headerKey)
    if( token === Permission_API_Credential?.headerValue ) {
        return true
    }

    throw new Error("Un-authorization access.")
}