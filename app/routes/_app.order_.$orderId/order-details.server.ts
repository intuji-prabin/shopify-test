import {useFetch} from '~/hooks/useFetch';
import {OrderStatus} from '~/routes/_app.order/order.server';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

export type Product = {
  amount: string;
  backOrderStatus: OrderStatus;
  defaultUOM: string;
  invoiceId: string;
  itemLineNumber: string;
  name: string;
  productID: string;
  productVariantID: string;
  quantity: number;
  selectedUOM: string;
  shippedQuantity: number;
  shippingStatus: OrderStatus;
  total: string;
  uom: string;
};

export type OrderDetails = {
  shippingStatus: string | null;
  carrier: string | null;
  shipmentMethod: string | null;
  shipmentDate: string | null;
  consignmentNumber: string | null;
  deliveryDate: string | null;
  shipmentTrackingUrl: string | null;
  shipmentDocumentUrl: string | null;
  trackingMethod: string | null;
  referenceNumber: string | null;
  carrierType: string | null;
  serviceLevel: string | null;
  poNumber: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCountry: string;
  shippingPostalCode: string;
  name: string;
  orderStatus: OrderStatus;
  totalPrice: string;
  currency: string;
  subTotal: string;
  freight: string;
  surCharges: string;
  totalExclGst: string;
  gst: string;
  discount: string;
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
