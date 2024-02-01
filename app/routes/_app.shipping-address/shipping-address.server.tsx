import { isRouteErrorResponse, useRouteError } from '@remix-run/react';
import { useFetch } from '~/hooks/useFetch';
import { ENDPOINT } from '~/lib/constants/endpoint.constant';
import { AllowedHTTPMethods } from '~/lib/enums/api.enum';


export interface ShippingAddressResponse {
  data: Data;
  extensions: Extensions;
}

export interface Data {
  customer: Customer;
}

export interface Customer {
  defaultAddress: DefaultAddress;
  addresses: Address[];
}

export interface Address {
  address1: string;
  phone: string;
  zip: string;
}

export interface DefaultAddress {
  address1: string;
  address2: string;
  phone: string;
  zip: string;
  firstName: string;
  country: string;
}

export interface Extensions {
  cost: Cost;
}

export interface Cost {
  requestedQueryCost: number;
  actualQueryCost: number;
  throttleStatus: ThrottleStatus;
}

export interface ThrottleStatus {
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}


export async function getAllCompanyShippingAddresses(shopifyId: string) {
  const body = JSON.stringify({
    query: GET_COMPANY_SHIPING_ADDRESS_QUERY(`${shopifyId}`),
  });
  const results = await useFetch<ShippingAddressResponse>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results.data.customer.defaultAddress || results.data.customer.addresses.length === 0) {
    throw new Response("Oh no! Something went wrong!", {
      status: 404,
    });
  }

  return results.data.customer;
}

const GET_COMPANY_SHIPING_ADDRESS_QUERY = (shopifyId: string) => (`query getShippingAddress{
 	customer(id: "${shopifyId}"){
    defaultAddress{
      address1,
      address2,
      phone,
      zip,
      country,
      firstName
    }
    addresses(first:15){
      address1,
      address2,
      phone,
      zip,
      country,
      firstName
    }
  }
}` as const)

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <section className='container'>
        <h1 className='text-center uppercase'>No data found</h1>
      </section>
    )
  }
}