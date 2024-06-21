import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {TeamColumn} from '~/routes/_app.team/use-column';
import {emitter} from '~/lib/utils/emitter.server';
import {EVENTS} from '~/lib/constants/events.contstent';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {getCustomerRolePermission} from '~/lib/customer-role/customer-role-permission';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {json} from '@remix-run/react';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {isImpersonating} from '~/lib/utils/auth-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

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
  request,
  customerId,
  query,
  context,
}: {
  request: Request;
  customerId: string;
  query: string | null;
  context: AppLoadContext;
}): Promise<TeamColumn[]> {
  const isImpersonatingCheck = await isImpersonating(request);

  const url = `${ENDPOINT.CUSTOMER_LIST.GET}/${customerId}${
    query ? '&search_query=' + query : ''
  }`;

  const response = await useFetch<ResponseData>({
    url,
    method: AllowedHTTPMethods.GET,
    impersonateEnableCheck: isImpersonatingCheck,
    context,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return normalizeTeams({context, teams: response.payload});
}

export async function getRoles({
  context,
  currentUserRole,
}: {
  context: AppLoadContext;
  currentUserRole: string;
}) {
  const {data: roles} = await getCustomerRolePermission(context);

  return roles
    .filter((item) => {
      const rolesValueList = item.value.split('-');

      const currentUserRolesLastValue = currentUserRole
        .split('-')
        .pop() as string;

      if (rolesValueList.includes(currentUserRolesLastValue)) {
        return item;
      }
    })
    .map((item) => ({...item, title: item.title.split(' ')[0]}));
}

export async function updateStatus({
  context,
  customerId,
  value,
  request,
}: {
  context: AppLoadContext;
  customerId: string;
  value: 'true' | 'false';
  request: Request;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const body = JSON.stringify({
      customerId,
      status: value,
    });
    const {userDetails} = await getUserDetails(request);
    const currentCustomerId = userDetails.id;

    const response = await useFetch<ResponseData>({
      method: AllowedHTTPMethods.POST,
      url: `${ENDPOINT.CUSTOMER.UPDATE_STATUS}/${currentCustomerId}`,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    const successMessage =
      value === 'true'
        ? 'Customer Activated Successfully'
        : 'Customer Deactivated Successfully';
    setSuccessMessage(messageSession, successMessage);

    emitter.emit(EVENTS.LOGOUT.KEY, {
      customerId: customerId,
      message: 'User Deactivated',
    });

    return json(
      {},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error.message);
      return json(
        {error},
        {
          headers: {
            'Set-Cookie': await messageCommitSession(messageSession),
          },
        },
      );
    }
    setErrorMessage(messageSession, DEFAULT_ERRROR_MESSAGE);
    return json(
      {error},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
}
