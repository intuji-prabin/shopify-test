import {useFetch} from '~/hooks/useFetch';
import {json, redirect} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {SubmitPayload} from '~/routes/_app.place-an-order.list/save-later-dialogbox';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {isImpersonating} from '~/lib/utils/auth-session.server';
import {AppLoadContext} from '@remix-run/server-runtime';

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

export async function getProductGroupOptions({
  context,
  request,
  customerId,
}: {
  context: AppLoadContext;
  request: Request;
  customerId: string;
}) {
  const productGroup = await getProductGroup({context, request, customerId});

  const productGroupOptions = productGroup.map((group) => ({
    label: group.groupName,
    value: String(group.groupId),
  }));

  return productGroupOptions;
}

export async function getPlaceAnOrderList({
  context,
  request,
  customerId,
  searchParams,
}: {
  context: AppLoadContext;
  request: Request;
  customerId: string;
  searchParams: URLSearchParams;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const baseUrl = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;

    const url = generateUrlWithParams({baseUrl, searchParams});

    const response = await useFetch<GetPlaceAnOrderListResponse>({
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

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

export async function deletePlaceAnOrderList({
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const {userDetails} = await getUserDetails(request);

    const customerId = userDetails.id.split('/').pop() as string;

    const response = await useFetch<DefaultResponse>({
      url: `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`,
      method: AllowedHTTPMethods.DELETE,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
  context,
  request,
}: {
  context: AppLoadContext;
  request: Request;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);

  try {
    const submitPayload = (await request.json()) as SubmitPayload;

    const {userDetails} = await getUserDetails(request);

    const customerId = userDetails.id.split('/').pop() as string;

    const createGroupUrl = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

    const updateGroupUrl = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

    let groupId = submitPayload.group;

    if (submitPayload.submitType === 'create') {
      const body = JSON.stringify({
        groupName: submitPayload.group.toLowerCase(),
      });

      const response = await useFetch<GroupCreateResponse>({
        method: AllowedHTTPMethods.POST,
        body,
        url: createGroupUrl,
        impersonateEnableCheck: isImpersonatingCheck,
        context,
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      groupId = String(response.payload.groupId);
    }

    const body = JSON.stringify({
      groupItemList: submitPayload.groupItemList,
      groupId,
    });

    const response = await useFetch<DefaultResponse>({
      method: AllowedHTTPMethods.POST,
      body,
      url: updateGroupUrl,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    setSuccessMessage(messageSession, response.message);
    return redirect(Routes.PENDING_ORDER, {
      headers: {
        'Set-Cookie': await messageCommitSession(messageSession),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error?.message);
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
