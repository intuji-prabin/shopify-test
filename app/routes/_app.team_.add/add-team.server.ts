import {AppLoadContext} from '@shopify/remix-oxygen';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {encrypt} from '~/lib/utils/cryptoUtils';
import {getUserDetails} from '~/lib/utils/user-session.server';

type AddTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context: AppLoadContext;
  userRole: string;
  file: File | any;
  request: Request;
};

export async function addTeam({
  address,
  context,
  file,
  email,
  fullName,
  userRole,
  phoneNumber,
  request,
}: AddTeamParams) {
  const {userDetails} = await getUserDetails(request);

  const customerId = userDetails?.id;
  const customerCode = userDetails.meta.customer_code.value;

  const formData: any = new FormData();
  formData.append('fullName', fullName);
  formData.append('profileImage', file);
  formData.append('email', email);
  formData.append('address', address);
  formData.append('userRole', userRole);
  formData.append('phoneNumber', phoneNumber);
  formData.append('customerCode', customerCode);
  const accessTocken = (await getAccessToken(context)) as string;
  const isImpersonatingCheck = await isImpersonating(request);

  const results: any = await fetch(
    `${ENDPOINT.CUSTOMER.CREATE}/${customerId}`,
    {
      method: AllowedHTTPMethods.POST,
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

  // if (!results.status) throw new Error("Couldn't create user");

  return response;
}

const CREATE_TEAM_MUTATION = `#graphql 
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
       id
    }
    customerUserErrors {
      field
      message
    }
  }
}
` as const;
