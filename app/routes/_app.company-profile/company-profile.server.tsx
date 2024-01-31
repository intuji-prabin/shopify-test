import { useFetch } from '~/hooks/useFetch';
import { ENDPOINT } from '~/lib/constants/endpoint.constant';
import { AllowedHTTPMethods } from '~/lib/enums/api.enum';

export interface CompanyProfileResponse {
  data: Data;
  extensions: Extensions;
}

export interface Data {
  companies: Companies;
}

export interface Companies {
  nodes: CompaniesNode[];
}

export interface CompaniesNode {
  id: string;
  name: string;
  note: string;
  externalId: string;
  metafields: Metafields;
  mainContact: MainContact;
  locations: Locations;
}

export interface Locations {
  nodes: LocationsNode[];
}

export interface LocationsNode {
  billingAddress: IngAddress;
  name: string;
  shippingAddress: IngAddress;
}

export interface IngAddress {
  address1: string;
  phone: string;
}

export interface MainContact {
  customer: Customer;
}

export interface Customer {
  email: string;
}

export interface Metafields {
  nodes: MetafieldsNode[];
}

export interface MetafieldsNode {
  key: string;
  value: string;
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



export async function getAllCompanyProfileDetails(companyId: string) {
  const body = JSON.stringify({
    query: GET_COMPANY_PROFILE_QUERY(`${companyId}`),
  });
  const results = await useFetch<CompanyProfileResponse>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });
  return results;
}

const GET_COMPANY_PROFILE_QUERY = (companyId: string) => (`query getCompany {
    companies(first:10,query:"external_id:${companyId}"){
      nodes{
        id
      name
      note
      externalId
      metafields(first:10){
        nodes{
          key
          value
        }
      }
      mainContact{
        customer{
          email
        }
      }
      locations(first:3){
        nodes{
          billingAddress{
            address1
            phone
          }
          name
          shippingAddress{
            address1
            phone
          }
        }
      }
      }
    }
  }` as const) 
