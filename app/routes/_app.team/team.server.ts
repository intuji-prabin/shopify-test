import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {TeamColumn} from '~/routes/_app.team/use-column';
import {emitter} from '~/lib/utils/emitter.server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';

interface MetaField {
  key: string;
  value: string;
}

export interface Customer {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  metafields: {
    nodes: MetaField[];
  };
}

type APIResponsePayload = Omit<TeamColumn, 'department'> &
  {department: string}[];

interface ResponseData {
  status: boolean;
  message: string;
  payload: APIResponsePayload;
}

async function normalizeTeams({
  teams,
  context,
}: {
  teams: APIResponsePayload;
  context: AppLoadContext;
}) {
  const {data: roles} = await getCustomerRolePermission(context);

  const normalizeTeams = teams.map((team) => {
    const department = roles.find((item) => item.value === team.department);
    return {
      ...team,
      department: {
        title: department?.title as string,
        value: department?.value as string,
      },
    } as TeamColumn;
  });

  return normalizeTeams;
}

export async function getAllTeams({
  customerId,
  query,
  context,
}: {
  customerId: string;
  query: string | null;
  context: AppLoadContext;
}): Promise<TeamColumn[]> {
  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.CUSTOMER_LIST.GET}?customer_id=${customerId}${
      query ? '&search_query=' + query : ''
    }`,
  });

  if (results.payload.length < 0) {
    throw new Error(results.message);
  }

  return normalizeTeams({context, teams: results.payload});
}

export async function getRoles({
  context,
  currentUserRole,
}: {
  context: AppLoadContext;
  currentUserRole: string;
}) {
  const {data: roles} = await getCustomerRolePermission(context);

  return roles.filter((item) => {
    const rolesValueList = item.value.split('-');

    const currentUserRolesLastValue = currentUserRole
      .split('-')
      .pop() as string;

    if (rolesValueList.includes(currentUserRolesLastValue)) {
      return item;
    }
  });
}

export async function updateStatus({
  customerId,
  value,
}: {
  customerId: string;
  value: 'true' | 'false';
}) {
  const body = JSON.stringify({
    customerId,
    status: value,
  });

  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.CUSTOMER.UPDATE_STATUS,
    body,
  });

  if (!results.status) {
    throw new Response('Oh no! Something went wrong!', {
      status: 404,
    });
  }
  emitter.emit(EVENTS.LOGOUT.KEY, {
    customerId: customerId,
    message: 'User Deactivated',
  });
}
