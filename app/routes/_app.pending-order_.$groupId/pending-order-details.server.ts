import {useFetch} from '~/hooks/useFetch';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export type Product = BulkOrderColumn;

interface DefaultResponse {
  status: boolean;
  message: string;
}

export type Group = {
  groupName: string;
  groupId: number;
  totalProduct: number;
  products: Product[];
};

interface GetProductGroupResponse extends DefaultResponse {
  payload: Group;
}

export async function updateGroup({
  groupId,
  groupName,
  customerId,
}: {
  groupId: number;
  groupName: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

  const body = JSON.stringify({groupId, groupName: groupName.toLowerCase()});

  const response = await useFetch<DefaultResponse>({
    url,
    method: AllowedHTTPMethods.PUT,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}

export async function deleteGroup({
  groupId,
  customerId,
}: {
  groupId: number;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

  const body = JSON.stringify({groupId});

  const response = await useFetch<DefaultResponse>({
    url,
    method: AllowedHTTPMethods.DELETE,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}

export async function getGroupDetails({
  groupId,
  customerId,
  searchParams,
}: {
  groupId: string;
  customerId: string;
  searchParams: URLSearchParams;
}) {
  try {
    const baseUrl = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

    const url = new URL(baseUrl);

    const params = new URLSearchParams();

    params.append('groupId', groupId);

    for (const [key, value] of searchParams) {
      if (value) {
        params.append(key, value);
      }
    }

    url.search = params.toString();

    const results = await useFetch<GetProductGroupResponse>({
      url: url.toString(),
    });

    if (!results.status) {
      throw new Error(results.message);
    }

    return results.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export async function addProductToGroup({
  body,
  customerId,
}: {
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

  const response = await useFetch<DefaultResponse>({
    method: AllowedHTTPMethods.POST,
    url,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}

export async function deleteGroupProduct({
  body,
  customerId,
}: {
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

  const response = await useFetch<DefaultResponse>({
    method: AllowedHTTPMethods.DELETE,
    url,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}

export async function updateGroupProduct({
  body,
  customerId,
}: {
  body: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

  const response = await useFetch<DefaultResponse>({
    method: AllowedHTTPMethods.PUT,
    url,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
