import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';
import {isImpersonating} from '~/lib/utils/auth-session.server';
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
  context,
  request,
  customerId,
  searchParams,
}: {
  context: AppLoadContext;
  request: Request;
  customerId: string;
  searchParams: URLSearchParams;
}) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const baseUrl = `${ENDPOINT.SUPPORT.TICKETS}/${customerId}`;

    const url = generateUrlWithParams({baseUrl, searchParams});

    const results = await useFetch<ResponseData>({
      method: AllowedHTTPMethods.GET,
      url,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
