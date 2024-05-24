import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {Invoices} from '~/routes/_app.invoices/invoices.server';

interface ResponseData {
  status: boolean;
  message: string;
  payload: Invoices;
}

export async function getInvoiceDetails({
  invoiceId,
  customerId,
}: {
  invoiceId: string;
  customerId: string;
}) {
  try {
    const url = `${ENDPOINT.INVOICE.GET_INVOCIE_DETAIL}/${customerId}/${invoiceId}`;

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
