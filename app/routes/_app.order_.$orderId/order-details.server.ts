import {useFetch} from '~/hooks/useFetch';
import {OrderStatus} from '../_app.order/order.server';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export type Product = {
  name: string;
  quantity: number;
  shippedQuantity: number;
  amount: string;
  invoiceId: string;
  total: string;
  shippingStatus: OrderStatus;
  backOrderStatus: OrderStatus;
  selectedUOM: string;
  defaultUOM: string;
};

type OrderDetails = {
  totalPrice: string;
  subTotal: string;
  freight: string;
  surCharges: string;
  totalExclGst: string;
  gst: string;
  currency: string;
  products: Product[];
};

type ResponseData = {
  status: boolean;
  message: string;
  payload: OrderDetails;
};

export async function getOrdersProductDetails({
  orderId,
  customerId,
}: {
  orderId: string;
  customerId: string;
}) {
  const url = `${ENDPOINT.ORDERS.GET_ORDER_DETAIL}/${customerId}/${orderId}`;
  try {
    const results = await useFetch<ResponseData>({
      method: AllowedHTTPMethods.GET,
      url,
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
