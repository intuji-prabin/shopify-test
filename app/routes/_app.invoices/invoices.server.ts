import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';

export type Invoices = {
  id: string;
  invoiceId: string;
  salesOrderNo: string;
  wareHouseNo: string;
  invoiceDate: string;
};

type ResponseData = {
  status: boolean;
  message: string;
  payload: {
    invoices: Invoices[];
    totalNumberOfInvoices: number;
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
