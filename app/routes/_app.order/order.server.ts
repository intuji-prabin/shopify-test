import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {isImpersonating} from '~/lib/utils/auth-session.server';

export type OrderStatus =
  | 'Received'
  | 'Order Cancel'
  | 'On Hold'
  | 'Processing'
  | 'Order Picked'
  | 'Dispatched'
  | 'Invoice Billing'
  | 'InTransit'
  | 'Delivered';

export type LineItem = {
  productId: string;
  variantId: string;
  uom: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderDate: string;
  poNumber: string;
  estimatedDate: string | null;
  internalOrderNumber: string;
  uniqueId: string;
  orderStatus: OrderStatus;
  orderBy: string;
  customerId: string;
  lineItems: LineItem[];
};

type Payload = {
  orderList: Order[];
  totalOrder: number;
};

type ResponseData = {
  status: boolean;
  message: string;
  payload: Payload;
};

export async function getAllOrders({
  request,
  customerId,
  searchParams,
}: {
  request: Request;
  customerId: string;
  searchParams: URLSearchParams;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const baseUrl = `${ENDPOINT.ORDERS.GET}/${customerId}`;
    const url = generateUrlWithParams({baseUrl, searchParams});

    const results = await useFetch<ResponseData>({
      method: AllowedHTTPMethods.GET,
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
