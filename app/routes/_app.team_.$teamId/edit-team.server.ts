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
  context?: AppLoadContext;
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
      url: `${ENDPOINT.CUSTOMER.GET}?customerId=${customerId}`,
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

export async function editTeam({
  address,
  email,
  fullName,
  userRole,
  phoneNumber,
  customerId,
  file,
}: EditTeamParams) {
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1] ?? '';

  if (typeof file !== 'undefined') {
    const {status} = await fileUpload({customerId, file});

    if (!status) throw new Error('Image upload unsuccessfull');
  }

  const body = JSON.stringify({
    customerId,
    address,
    userRole,
    firstName,
    lastName,
    email,
    phoneNumber,
  });

  const results = await useFetch<CustomerResponse>({
    method: AllowedHTTPMethods.PUT,
    url: ENDPOINT.CUSTOMER.UPDATE,
    body,
  });

  if (!results.status) {
    throw new Error(results.message);
  }

  return results;
}
