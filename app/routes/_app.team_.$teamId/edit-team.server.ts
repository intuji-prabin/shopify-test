import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {EditTeamFormType} from '~/routes/_app.team_.add/team-form';
import {CustomerData} from '../_public.login/login.server';

type CustomerDetails = Omit<EditTeamFormType, 'profileImage'> & {
  profileImageUrl: string;
  companyId: string;
};

type EditTeamParams = {
  context: AppLoadContext;
  request: Request;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  addressId: string;
  userRole: string;
  customerId: string;
  file: File | undefined;
  userDetails: CustomerData;
};

export type CustomerResponse = {
  status: boolean;
  message: string;
  payload: CustomerDetails;
};

export async function getCustomerById({
  context,
  request,
  customerId,
}: {
  context: AppLoadContext;
  request: Request;
  customerId: string;
}): Promise<CustomerDetails> {
  const isImpersonatingCheck = await isImpersonating(request);
  try {
    const customerResponse = await useFetch<CustomerResponse>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.CUSTOMER.GET}/${customerId}`,
      impersonateEnableCheck: isImpersonatingCheck,
      context,
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
  context,
  request,
  address,
  addressId,
  email,
  fullName,
  userRole,
  phoneNumber,
  customerId,
  file,
  userDetails,
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
  const accessTocken = (await getAccessToken(context)) as string;
  const isImpersonatingCheck = await isImpersonating(request);

  const results: any = await fetch(
    `${ENDPOINT.CUSTOMER.CREATE}/${userDetails.id}`,
    {
      method: AllowedHTTPMethods.PUT,
      body: formData,
      headers: {
        Authorization: accessTocken,
        'Impersonate-Enable': isImpersonatingCheck,
      },
    },
  );

  const response = await results.json();

  if (response?.error) {
    throw new Error('Customer not created');
  }

  if (!response?.status) {
    throw new Error(response?.message);
  }

  return results;
}
