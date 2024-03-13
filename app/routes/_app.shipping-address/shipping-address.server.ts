import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type ShippingAddressResponse = {
  status: boolean;
  message: string;
  payload: ShippingAddress;
};

export type ShippingAddress = {
  defaultAddress: DefaultAddress;
  addresses: Address[];
};

export type DefaultAddress = {
  address1: string;
  address2: string;
  phone: string;
  zip: string;
  firstName: string;
  country: string;
};

export type Address = DefaultAddress;

export async function getAllCompanyShippingAddresses(customerId: string) {
  try {
    const customer = customerId.split('/').pop();

    const response = await useFetch<ShippingAddressResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.COMPANY.GET_SHIPPING_ADDRESS}?customerId=${customer}`,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      return null;
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {status: 500});
  }
}
