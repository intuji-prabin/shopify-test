import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export type OrderStatus =
  | 'received'
  | 'processing'
  | 'order_picked'
  | 'dispatched'
  | 'in_transit'
  | 'delivered';

export type Order = {
  id: string;
  orderDate: string;
  poNumber: string;
  estimatedDate: string | null;
  internalOrderNumber: string;
  orderStatus: OrderStatus;
  orderBy: string;
  customerId: string;
};

type OrderPageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
  startCursor: string;
};

type Payload = {
  orderList: Order[];
  orderPageInfo: OrderPageInfo;
};

type ResponseData = {
  status: boolean;
  message: string;
  payload: Payload;
};

export async function getAllOrders({customerId}: {customerId: string}) {
  try {
    const url = `${ENDPOINT.ORDERS.GET}/${customerId}`;

    const results = await useFetch<ResponseData>({
      url,
      method: AllowedHTTPMethods.GET,
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
