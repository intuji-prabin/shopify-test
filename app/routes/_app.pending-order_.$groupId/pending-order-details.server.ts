import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {BulkOrderColumn} from '../_app.cart-list/order-my-products/use-column';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {Session, SessionData, json} from '@remix-run/server-runtime';

export type Product = BulkOrderColumn;

type Group = {
  groupName: string;
  groupId: number;
  totalProduct: number;
  products: Product[];
};

type GetProductResponseSchema = {
  status: boolean;
  message: string;
  payload: Group;
};

export async function getGroupDetails({
  groupId,
  customerId,
}: {
  groupId: string;
  customerId: string;
}) {
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}?groupId=${groupId}`;

    const results = await useFetch<GetProductResponseSchema>({url});

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

type UpdateGroupDetailsResponseSchema = {
  status: boolean;
  message: string;
};

export async function updateGroupDetails({
  groupId,
  groupName,
  customerId,
}: {
  groupId: number;
  groupName: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

  const body = JSON.stringify({groupId, groupName});

  const response = await useFetch<UpdateGroupDetailsResponseSchema>({
    url,
    method: AllowedHTTPMethods.PUT,
    body,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
