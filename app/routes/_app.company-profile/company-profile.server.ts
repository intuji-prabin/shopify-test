import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type Metafield = {
  id: string;
  key: string;
  value: string;
  type: string;
};

type Locations = {
  nodes: LocationsNode[];
};

type LocationsNode = {
  billingAddress: IngAddress;
  name: string;
  shippingAddress: IngAddress;
};

type IngAddress = {
  address1: string;
  phone: string;
};

type MainContact = {
  customer: Customer;
};

type Customer = {
  email: string;
};

export type CompanyProfile = {
  meta: Record<string, Metafield>;
  id: string;
  name: string;
  note: string;
  externalId: string;
  mainContact: MainContact;
  locations: Locations;
};

type CompanyProfileResponse = {
  status: boolean;
  message: string;
  payload: CompanyProfile;
};

export async function getAllCompanyProfileDetails(companyId: string) {
  const results = await useFetch<CompanyProfileResponse>({
    method: AllowedHTTPMethods.GET,
    url: `${ENDPOINT.COMPANY.GET_PROFILE}?companyId=${companyId}`,
  });

  if (!results.status) {
    throw new Response('Oh no! Something went wrong!', {
      status: 404,
    });
  }

  return results.payload;
}
