import {AppLoadContext} from '@shopify/remix-oxygen';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {fileUpload} from '~/lib/utils/file-upload';
import {CustomerResponse} from '~/routes/_app.team_.$teamId/edit-team.server';
import {getUserDetails} from '~/lib/utils/user-session.server';

type AddTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context: AppLoadContext;
  userRole: string;
  file: File | undefined;
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
  const {storefront} = context;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];

  const {userDetails} = await getUserDetails(request);

  const companyId = userDetails.meta.company_id.value;

  const metaParentValue = userDetails.meta.parent.value;

  const parentId =
    metaParentValue === 'null' ? userDetails.id : metaParentValue;

  const team = await storefront.mutate(CREATE_TEAM_MUTATION, {
    variables: {
      input: {
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        password: 'defaultPass',
      },
    },
  });

  if ((team.customerCreate?.customerUserErrors.length as number) > 0) {
    throw new Error(team.customerCreate?.customerUserErrors[0].message);
  }

  const customerId = team.customerCreate?.customer?.id as string;

  try {
    if (typeof file !== 'undefined') {
      const {status} = await fileUpload({customerId, file});

      if (!status) throw new Error('Image upload unsuccessfull');
    }
  } catch (error) {
    return;
  }

  const body = JSON.stringify({
    companyId,
    customerId,
    address,
    parentId,
    userRole,
  });

  const results = await useFetch<CustomerResponse>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.CUSTOMER.CREATE,
    body,
  });

  if (!results.status) throw new Error("Couldn't create user");

  const emailSend = await customerRecover({email, context});

  if (!emailSend) {
    throw new Error("Email couldn't send");
  }
  return results;
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
