import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {TicketColumn} from '~/routes/_app.support_.tickets/use-column';

type ResponseData = {
  status: boolean;
  message: string;
  payload: {
    totalCount: number;
    tickets: TicketColumn[];
  };
};

export async function getAllTickets({
  customerId,
  request,
}: {
  customerId: string;
  request: Request;
}) {
  try {
    const params = [
      'page',
      'search',
      'status',
      'departmentId',
      'createdDateTo',
      'createdDateFrom',
    ];

    const url = `${ENDPOINT.SUPPORT.TICKETS}/${customerId}?`;

    const generatedUrl = generateUrlWithParams({url, params, request});

    const results = await useFetch<ResponseData>({
      method: AllowedHTTPMethods.GET,
      url: generatedUrl,
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
