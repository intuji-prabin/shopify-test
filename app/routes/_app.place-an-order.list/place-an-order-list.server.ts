import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {SubmitPayload} from './save-later-dialogbox';

export async function getProductGroupOptions({
  customerId,
}: {
  customerId: string;
}) {
  const productGroup = await getProductGroup({customerId});

  const productGroupOptions = productGroup.map((group) => ({
    label: group.groupName,
    value: String(group.groupId),
  }));

  return productGroupOptions;
}

export type Product = BulkOrderColumn;
interface DefaultResponse {
  status: boolean;
  message: string;
}

interface GroupCreateResponse extends DefaultResponse {
  payload: {
    groupId: number;
    companyId: string;
    groupName: string;
  };
}
interface Payload {
  products: Product[];
  totalProduct: number;
}
interface GetPlaceAnOrderListResponse extends DefaultResponse {
  payload: Payload;
}

export async function getPlaceAnOrderList({
  customerId,
  searchParams,
}: {
  customerId: string;
  searchParams: URLSearchParams;
}) {
  try {
    const baseUrl = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;

    const url = generateUrlWithParams({baseUrl, searchParams});

    const response = await useFetch<GetPlaceAnOrderListResponse>({url});

    if (!response.status) {
      throw new Error(response.message);
    }
    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}

export async function deletePlaceAnOrderList({request}: {request: Request}) {
  try {
    const {userDetails} = await getUserDetails(request);

    const customerId = userDetails.id.split('/').pop() as string;

    const response = await useFetch<DefaultResponse>({
      url: `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`,
      method: AllowedHTTPMethods.DELETE,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    return response;
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
  sumbitPayload,
  request,
}: {
  sumbitPayload: SubmitPayload;
  request: Request;
}) {
  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails.id.split('/').pop() as string;

  const createGroupUrl = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

  const updateGroupUrl = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

  let groupId = sumbitPayload.group;

  if (sumbitPayload.submitType === 'create') {
    const body = JSON.stringify({
      groupName: sumbitPayload.group,
    });

    const response = await useFetch<GroupCreateResponse>({
      method: AllowedHTTPMethods.POST,
      body,
      url: createGroupUrl,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    groupId = String(response.payload.groupId);
  }

  const body = JSON.stringify({
    groupItemList: sumbitPayload.groupItemList,
    groupId,
  });

  const response = await useFetch<DefaultResponse>({
    method: AllowedHTTPMethods.POST,
    body,
    url: updateGroupUrl,
  });

  if (!response.status) {
    throw new Error(response.message);
  }

  return response;
}
