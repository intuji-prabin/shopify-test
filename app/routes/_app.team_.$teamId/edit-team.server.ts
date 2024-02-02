import {AppLoadContext} from '@shopify/remix-oxygen';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {EditTeamFormType} from '../_app.team_.add/team-form';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {fileUpload} from '~/lib/utils/file-upload';

type CustomerDetails = Omit<EditTeamFormType, 'profileImage' | 'customerId'> & {
  profileImageUrl: string;
};

type CustomerData = {
  email: string;
  displayName: string;
  phone: string;
  addresses: {address1: string}[];
  metafields: {
    nodes: {
      key: string;
      value: string;
    }[];
  };
};

type MetaField = {
  key: string;
  value: string;
};

/**
 * @description Format Customer Detail Data
 * @param customer
 * @returns
 */
function formatCustomerDetailData(customer: CustomerData): CustomerDetails {
  const metafields = customer?.metafields.nodes;

  console.log({metafields});

  const userRoleMetafield = metafields?.find(
    (metafield: MetaField) => metafield.key === 'role',
  );

  const userRole = userRoleMetafield ? userRoleMetafield.value : '';

  const imageUrlMetafield = metafields?.find(
    (metafield: MetaField) => metafield.key === 'image_url',
  );

  const imageUrl = imageUrlMetafield
    ? imageUrlMetafield.value
    : DEFAULT_IMAGE.DEFAULT;

  const details: CustomerDetails = {
    fullName: customer?.displayName,
    email: customer?.email,
    phoneNumber: customer?.phone,
    address:
      customer?.addresses?.length > 0
        ? customer?.addresses[0].address1
        : 'defaultAddress',
    userRole,
    profileImageUrl: imageUrl,
  };

  return details;
}

export async function getCustomerDetail({customerId}: {customerId: string}) {
  const body = JSON.stringify({
    query: GET_CUSTOMER_DETAIL,
    variables: {
      id: `gid://shopify/Customer/${customerId}`,
    },
  });

  const results = await useFetch<any>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  if (!results) {
    throw new Error("Couldn't get user data");
  }

  const customerDetails = formatCustomerDetailData(results?.data?.customer);

  return {...customerDetails, customerId};
}

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
  const lastName = fullName.split(' ')[1];

  const ownerId = `gid://shopify/Customer/${customerId}`;

  if (typeof file !== 'undefined') {
    const {status} = await fileUpload({customerId: ownerId, file});

    if (!status) throw new Error('Image upload unsuccessfull');
  }

  const body = JSON.stringify({
    query: UPDATE_TEAM_MUTATION,
    variables: {
      customer: {
        id: `gid://shopify/Customer/${customerId}`,
        firstName,
        lastName,
        email,
        phone: phoneNumber,
        addresses: {
          address1: address,
        },
      },
      meta: [
        {
          ownerId,
          namespace: 'auth',
          key: 'role',
          value: userRole,
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

  if (!results) {
    throw new Error("Couldn't update customer");
  }

  return results;
}

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

const GET_CUSTOMER_DETAIL = `#graphql
query GetCustomerDetail($id:ID!){
    customer(id:$id) {
        email
        displayName
        phone
        addresses {
          address1
        }
        metafields(first: 10) {
          nodes {
            key
            value
          }
        }
      }
  }
` as const;
