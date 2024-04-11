import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export type CompanyProfile = {
  id: string;
  externalId: string;
  description: string;
  companyName: string;
  companyFax: string;
  companyEmail: string;
  inventoryLocationName: string;
  logoUrl: string;
  address: string;
  phone: string;
};

type CompanyProfileResponse = {
  status: boolean;
  message: string;
  payload: CompanyProfile;
};

export async function getAllCompanyProfileDetails({userId}: {userId: string}) {
  try {
    const response = await useFetch<CompanyProfileResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.COMPANY.GET_PROFILE}/${userId}`,
    });

    if (!response.status) {
      throw new Error(response.message);
    }

    return response.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {status: 500});
  }
}
