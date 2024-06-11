import {json} from '@remix-run/react';
import {useFetch} from '~/hooks/useFetch';
import {redirect} from '@remix-run/server-runtime';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {Routes} from '~/lib/constants/routes.constent';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {addedBulkCart} from '~/routes/_app.wishlist/bulk.cart.server';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {GroupItem} from '~/routes/_app.pending-order_.$groupId/select-product-context';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';

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

export async function getGroupDetails({
  request,
  groupId,
  customerId,
  searchParams,
}: {
  request: Request;
  groupId: string;
  customerId: string;
  searchParams: URLSearchParams;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
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
      impersonateEnableCheck: isImpersonatingCheck,
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

export async function updateGroup({
  request,
  groupId,
  groupName,
  customerId,
}: {
  groupId: number;
  request: Request;
  groupName: string;
  customerId: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

    const body = JSON.stringify({groupId, groupName: groupName.toLowerCase()});

    const response = await useFetch<DefaultResponse>({
      url,
      method: AllowedHTTPMethods.PUT,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    setSuccessMessage(messageSession, response.message);

    return json(
      {response},
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

export async function deleteGroup({
  groupId,
  request,
  customerId,
}: {
  groupId: number;
  request: Request;
  customerId: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);

  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

    const body = JSON.stringify({groupId});

    const response = await useFetch<DefaultResponse>({
      url,
      method: AllowedHTTPMethods.DELETE,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
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

export async function addProductToGroup({
  body,
  request,
  customerId,
}: {
  body: string;
  request: Request;
  customerId: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

    const response = await useFetch<DefaultResponse>({
      method: AllowedHTTPMethods.POST,
      url,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
    });

    if (!response.status) {
      throw new Error(response.message);
    }
    setSuccessMessage(messageSession, response.message);

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

export async function deleteGroupProduct({
  groupId,
  request,
  placeIds,
  customerId,
}: {
  customerId: string;
  groupId: number;
  placeIds: number[];
  request: Request;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

    const body = JSON.stringify({
      groupId,
      placeIds,
    });
    const response = await useFetch<DefaultResponse>({
      method: AllowedHTTPMethods.DELETE,
      url,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    setSuccessMessage(messageSession, response.message);

    return redirect(`${Routes.PENDING_ORDER}/${groupId}`, {
      headers: {
        'Set-Cookie': await messageCommitSession(messageSession),
      },
    });
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

export async function updateGroupProduct({
  groupId,
  request,
  customerId,
}: {
  groupId: number;
  request: Request;
  customerId: string;
}) {
  const messageSession = await getMessageSession(request);
  const isImpersonatingCheck = await isImpersonating(request);

  try {
    const jsonPayload = (await request.json()) as GroupItem[];

    const body = JSON.stringify({
      groupId,
      groupItemList: jsonPayload,
    });

    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP_ITEM}/${customerId}`;

    const response = await useFetch<DefaultResponse>({
      method: AllowedHTTPMethods.PUT,
      url,
      body,
      impersonateEnableCheck: isImpersonatingCheck,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    setSuccessMessage(messageSession, response.message);

    return json(
      {response},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
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
    setErrorMessage(
      messageSession,
      'Could not update. Please try again later.',
    );
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

export async function addToCart({
  context,
  formData,
  request,
}: {
  formData: FormData;
  context: AppLoadContext;
  request: Request;
}) {
  const messageSession = await getMessageSession(request);

  try {
    const cartInfo = Object.fromEntries(formData);

    const accessTocken = (await getAccessToken(context)) as string;

    await addedBulkCart(cartInfo, context, accessTocken, request);

    setSuccessMessage(messageSession, 'Item added to cart successfully');

    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      setErrorMessage(messageSession, error?.message);
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    }
    setErrorMessage(
      messageSession,
      'Item not added to cart. Please try again later.',
    );
    return json(
      {},
      {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      },
    );
  }
}
