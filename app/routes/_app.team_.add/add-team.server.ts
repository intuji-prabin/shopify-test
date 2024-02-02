import {AppLoadContext} from '@shopify/remix-oxygen';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/authsession.server';
import {fileUpload} from '~/lib/utils/file-upload';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toastsession.server';
import {json} from 'zod-form-data';

interface Role {
  title: string;
  value: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  title: string;
  value: string;
}

export interface RolesResponse {
  data: Role[];
  msg: string;
  status: boolean;
}

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
  request,
  fullName,
  userRole,
  phoneNumber,
}: AddTeamParams) {
  const {storefront} = context;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];
  const messageSession = await getMessageSession(request);

  const {userDetails} = await getUserDetails(context);

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

  const ownerId = team?.customerCreate?.customer?.id;

  const body = JSON.stringify({
    query: UPDATE_TEAM_MUTATION,
    variables: {
      customer: {
        id: ownerId,
        addresses: {
          address1: address,
        },
        tags: [`company_id=${companyId}`],
      },
      meta: [
        {
          ownerId,
          namespace: 'auth',
          key: 'role',
          value: userRole,
          type: 'string',
        },
        {
          ownerId,
          namespace: 'company',
          key: 'company_id',
          value: companyId,
          type: 'string',
        },
        {
          ownerId,
          namespace: 'active',
          key: 'status',
          value: 'true',
          type: 'string',
        },
        {
          ownerId,
          namespace: 'parent',
          key: 'parent',
          value: parentId,
          type: 'string',
        },
        // {
        //   key: 'image_url',
        //   namespace: 'customer',
        //   ownerId,
        //   type: 'string',
        //   value: imageUrl,
        // },
      ],
    },
  });

  const results = await useFetch({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results) throw new Error("Couldn't create user");

  try {
    if (typeof file !== 'undefined') {
      const {status} = await fileUpload({customerId, file});

      if (!status) throw new Error('Image upload unsuccessfull');
    }
  } catch (error) {
    return;
  }

  const emailSend = await customerRecover({email, context});

  if (!emailSend) {
    throw new Error("Email couldn't send");
  }
}

export async function getRoles(): Promise<RolesResponse> {
  const roles = await useFetch<RolesResponse>({url: ENDPOINT.ROLE.GET});
  return roles;
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

const UPDATE_TEAM_MUTATION = `
  mutation updateCustomerWithMeta($customer: CustomerInput!, $meta: [MetafieldsSetInput!]!) {
    customerUpdate(input: $customer) {
      customer {
        id
      }
    }
    metafieldsSet(metafields: $meta) {
      metafields {
        key
        value
      }
    }
  }
` as const;
