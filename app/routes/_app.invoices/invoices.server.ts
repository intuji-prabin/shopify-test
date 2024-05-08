import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';

export type InvoiceStatus =
  | 'received'
  | 'processing'
  | 'order_picked'
  | 'dispatched'
  | 'in_transit'
  | 'delivered';

export type Invoices = {
  id: number;
  invoiceId: string;
  salesOrderNo: string;
  iscalaCompanyId: string;
  invoiceDate: string;
  wareHouseNo: string;
  files: string;
  consignmentNo: string;
  deliveryNo: string;
  dispatchDetails: string;
  invoiceAmount: string;
  invoiceStatus: InvoiceStatus;
  poNumber: string;
};

type ResponseData = {
  status: boolean;
  message: string;
  payload: {
    invoiceList: Invoices[];
    totalInvoices: number;
  };
};

export async function getAllInvoices({
  customerId,
  searchParams,
}: {
  customerId: string;
  searchParams: URLSearchParams;
}) {
  try {
    const baseUrl = `${ENDPOINT.INVOICE.GET}/${customerId}`;

    const url = generateUrlWithParams({baseUrl, searchParams});

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
