 export const getCustomerRolePermission = async ( context : any ) => {
    try {
        const { storefront } = await context
        const rolePermissionResponse = await storefront.query( GET_ROLES_AND_PERMISSION )
        const formatedList = await formateRolesAndPermission( rolePermissionResponse )
        return {
            status : true,
            message : "Data get successfully",
            data : formatedList
        }
    } catch( error ) {
        if( error instanceof Error ) {
            console.log("ererer", error?.message)
            return []
        } 
        return []
    }
}

const formateRolesAndPermission = async ( response : any ) => {
    const roleListEgdge = response?.metaobjects
    if( roleListEgdge?.edges.length < 1 ) {
        return []
    }

    const rolePermission = roleListEgdge?.edges.map( ( items : any ) => {
        const role = items?.node?.role?.value
        const permission = items?.node?.permission?.value

        return {
            title : role,
            value : role.toLowerCase(),
            permissions : formatingPermission( permission )
        }
    })
    return rolePermission
}

const formatingPermission = ( permission : any ) => {
    const permissionList : any = JSON.parse( permission )
    const permissionFormate = permissionList.map( ( items : any , index : any ) => {
        return {
            id : index + 1,
            value : items,
            title : items.replace("_", " ") 
        }
    })
    return permissionFormate
}

const GET_ROLES_AND_PERMISSION = `query getMeta {
    metaobjects(type : "customer_roles_and_permission", first: 100) {
      edges {
          node {
              role : field(key: "role") { value }
              permission: field(key: "permission") { value }
          }
      }
    }
  }` as const
