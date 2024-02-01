import {AppLoadContext} from '@shopify/remix-oxygen';
import {customerRecover} from '~/routes/_public.forget-password/forget-password.server';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {getUserDetails} from '~/lib/utils/authsession.server';
import {fileUpload} from '~/lib/utils/file-upload';

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
  file: File;
};

export async function addTeam({
  address,
  context,
  file,
  email,
  fullName,
  userRole,
  phoneNumber,
}: AddTeamParams) {
  const {storefront} = context;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];

  const {userDetails} = await getUserDetails(context);

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

  const fileUploadStatus = await fileUpload({customerId, file});

  if (!fileUploadStatus) throw new Error('Image upload unsuccessfull');

  const body = JSON.stringify({
    query: UPDATE_TEAM_MUTATION,
    variables: {
      customer: {
        id: team?.customerCreate?.customer?.id,
        addresses: {
          address1: address,
        },
      },
      meta: [
        {
          ownerId: team?.customerCreate?.customer?.id,
          namespace: 'auth',
          key: 'role',
          value: userRole,
          type: 'string',
        },
        {
          ownerId: team?.customerCreate?.customer?.id,
          namespace: 'company',
          key: 'company_id',
          value: 'abc123',
          type: 'string',
        },
        {
          ownerId: team?.customerCreate?.customer?.id,
          namespace: 'active',
          key: 'status',
          value: 'true',
          type: 'string',
        },
        {
          ownerId: team?.customerCreate?.customer?.id,
          namespace: 'parent',
          key: 'parent_id',
          value: parentId,
          type: 'string',
        },
      ],
    },
  });

  const results = await useFetch({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results) throw new Error("Couldn't create user");

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
