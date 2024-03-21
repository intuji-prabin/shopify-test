import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';

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

export async function getProductGroup({customerId}: {customerId: string}) {
  try {
    const url = `${ENDPOINT.PENDING_ORDERS.PRODUCT_GROUP}/${customerId}`;

    const results = await useFetch<GetProductGroupResponseSchema>({url});

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
