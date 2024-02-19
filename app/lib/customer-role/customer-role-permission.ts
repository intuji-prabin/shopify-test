import {AppLoadContext} from '@remix-run/server-runtime';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

interface Role {
  title: string;
  value: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  title: string;
  value: string;
}

interface Node {
  role: {value: string};
  permission: {value: string};
}

interface Edge {
  node: Node;
}

interface Metaobjects {
  edges: Edge[];
}

interface Response {
  metaobjects: Metaobjects;
}

export interface RolesResponse {
  data: Role[];
  message: string;
  status: boolean;
}

export async function getCustomerRolePermission(
  context: AppLoadContext,
): Promise<RolesResponse> {
  try {
    const {storefront} = context;
    const rolePermissionResponse = await storefront.query(
      GET_ROLES_AND_PERMISSION,
    );
    const formatedList = await formatRolesAndPermission(rolePermissionResponse);

    return {
      status: true,
      message: 'Data get successfully',
      data: formatedList,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: false,
        message: error.message,
        data: [],
      };
    }
    return {
      status: false,
      message: DEFAULT_ERRROR_MESSAGE,
      data: [],
    };
  }
}

export async function formatRolesAndPermission(response: Response) {
  const roleListEgdge = response?.metaobjects;
  if (roleListEgdge?.edges.length < 1) {
    return [];
  }

  const rolePermission = roleListEgdge?.edges.map((items: Edge) => {
    const role = items?.node?.role?.value;
    const permission = items?.node?.permission?.value;

    return {
      title: role,
      value: role.toLowerCase(),
      permissions: formatPermission(permission),
    };
  });
  return rolePermission;
}

function formatPermission(permission: string) {
  const permissionList = JSON.parse(permission) as string[];
  const formatPermission = permissionList.map(
    (items: string, index: number) => {
      return {
        id: index + 1,
        value: items,
        title: items.replace('_', ' '),
      };
    },
  );
  return formatPermission;
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
  }` as const;
