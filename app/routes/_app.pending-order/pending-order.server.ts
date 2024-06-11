import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export type ProductGroup = {
  groupId: number;
  groupName: string;
  totalItems: number;
};

type GetProductGroupResponseSchema = {
  status: boolean;
  message: string;
  payload: ProductGroup[];
};

export async function getProductGroup({
  request,
  customerId,
}: {
  request: Request;
  customerId: string;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

    const results = await useFetch<GetProductGroupResponseSchema>({
      url,
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
