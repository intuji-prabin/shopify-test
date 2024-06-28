import {AppLoadContext} from '@remix-run/server-runtime';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {isImpersonating} from '~/lib/utils/auth-session.server';

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
  fax: string;
  suburb: string;
  houseNumber: string;
};

export type Address = DefaultAddress;

export async function getAllCompanyShippingAddresses(
  context: AppLoadContext,
  request: Request,
  customerId: string,
  cartList: boolean = false,
) {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const customer = customerId?.split('/')?.pop();

    const response = await useFetch<ShippingAddressResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.COMPANY.GET_SHIPPING_ADDRESS}/${customer}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
    });
    if (!response.status) {
      // this case is for the cart page if shipping address is not added
      if (cartList) {
        return null;
      }
      throw new Error(response.message);
    }
    return response.payload;
  } catch (error) {
    console.log('first error', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {status: 500});
  }
}
