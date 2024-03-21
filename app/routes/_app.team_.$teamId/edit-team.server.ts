import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {EditTeamFormType} from '~/routes/_app.team_.add/team-form';
import {fileUpload} from '~/lib/utils/file-upload';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';

type CustomerDetails = Omit<EditTeamFormType, 'profileImage'> & {
  profileImageUrl: string;
  companyId: string;
};

type EditTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  addressId: string;
  context: AppLoadContext;
  userRole: string;
  customerId: string;
  file: File | undefined;
};

export type CustomerResponse = {
  status: boolean;
  message: string;
  payload: CustomerDetails;
};

export async function getCustomerById({
  customerId,
}: {
  customerId: string;
}): Promise<CustomerDetails> {
  try {
    const customerResponse = await useFetch<CustomerResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.CUSTOMER.GET}/${customerId}`,
    });

    if (!customerResponse.status) {
      throw new Error(customerResponse.message);
    }

    return customerResponse.payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Response(DEFAULT_ERRROR_MESSAGE, {status: 500});
  }
}

export async function updateTeam({
  address,
  addressId,
  email,
  fullName,
  userRole,
  phoneNumber,
  customerId,
  file,
}: EditTeamParams) {
  // console.log('addressId', addressId);

  const formData: any = new FormData();
  formData.append('fullName', fullName);
  formData.append('profileImage', file);
  formData.append('email', email);
  formData.append('address', address);
  formData.append('userRole', userRole);
  formData.append('phoneNumber', phoneNumber);
  formData.append('customerId', customerId);
  formData.append('addressId', addressId);

  const results: any = await fetch(ENDPOINT.CUSTOMER.CREATE, {
    method: AllowedHTTPMethods.PUT,
    body: formData,
  });

  const response = await results.json();

  if (response?.error) {
    throw new Error('Customer not created');
  }

  if (!response?.status) {
    throw new Error(response?.message);
  }

  return results;
}
