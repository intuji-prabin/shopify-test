import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {getProductGroup} from '~/routes/_app.pending-order/pending-order.server';
import {BulkOrderColumn} from '~/routes/_app.cart-list/order-my-products/use-column';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {generateUrlWithParams} from '~/lib/helpers/url.helper';

export async function getProductGroupOptions({
  customerId,
}: {
  customerId: string;
}) {
  const productGroup = await getProductGroup({customerId});

  const productGroupOptions = productGroup.map((group) => ({
    label: group.groupName,
    value: String(group.groupId),
  }));

  return productGroupOptions;
}

export type Product = BulkOrderColumn;
interface DefaultResponse {
  status: boolean;
  message: string;
}

interface Payload {
  products: Product[];
  totalProduct: number;
}
interface GetPlaceAnOrderListResponse extends DefaultResponse {
  payload: Payload;
}

export async function getPlaceAnOrderList({
  customerId,
  searchParams,
}: {
  customerId: string;
  searchParams: URLSearchParams;
}) {
  try {
    const baseUrl = `${ENDPOINT.PLACE_AN_ORDER}/${customerId}`;

    const url = generateUrlWithParams({baseUrl, searchParams});

    const response = await useFetch<GetPlaceAnOrderListResponse>({url});

    if (!response.status) {
      throw new Error(response.message);
    }
    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Response(DEFAULT_ERRROR_MESSAGE, {
      status: 500,
    });
  }
}
