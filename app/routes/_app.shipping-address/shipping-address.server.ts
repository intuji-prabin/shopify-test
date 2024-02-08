import {useFetch} from '~/hooks/useFetch';
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
  const customer = customerId.split('/').pop();
  const results = await useFetch<ShippingAddressResponse>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.COMPANY.GET_SHIPPING_ADDRESS}?customerId=${customer}`,
  });

  if (!results.status) {
    throw new Response(results.message, {
      status: 404,
    });
  }

  return results.payload;
}
