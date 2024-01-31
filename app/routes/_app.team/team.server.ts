import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {TeamColumn} from './use-column';

interface MetaField {
  key: string;
  value: string;
}

interface Customer {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  metafields: {
    nodes: MetaField[];
  };
}

interface CustomerNode {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  metafields: {
    nodes: MetaField[];
  };
}

interface CustomersData {
  customers: {
    nodes: CustomerNode[];
  };
}

interface ResponseData {
  data: CustomersData;
}

function transformCustomer(customer: Customer): TeamColumn {
  const {id, displayName: name, email, phone, metafields} = customer;
  let department = '';
  let status = false;

  // Extracting values from metafields
  metafields.nodes.forEach((node) => {
    if (node.key === 'role') {
      department = node.value;
    } else if (node.key === 'status') {
      status = node.value === 'true';
    }
  });

  // Return transformed object
  return {
    id,
    name,
    email,
    department,
    contactNumber: phone,
    status,
  };
}

export async function getAllTeams({query}: {query: string | null}) {
  const body = JSON.stringify({
    query: GET_TEAM_MEMBER_QUERY,
    variables: {
      name: query,
    },
  });
  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });
  const teamColumns: TeamColumn[] =
    results.data.customers.nodes.map(transformCustomer);

  return teamColumns;
}

export async function updateStatus({
  customerId,
  value,
}: {
  customerId: string;
  value: 'true' | 'false';
}) {
  const body = JSON.stringify({
    query: UPDATE_STATUS,
    variables: {
      metafields: [
        {
          key: 'status',
          namespace: 'active',
          ownerId: customerId,
          type: 'string',
          value,
        },
      ],
    },
  });

  const results = await useFetch<ResponseData>({
    method: AllowedHTTPMethods.POST,
    url: ENDPOINT.ADMIN.URL,
    body,
  });

  return results;
}

const GET_TEAM_MEMBER_QUERY = `query getCustomers($name:String){
  customers(first:40, query:$name) {
    nodes {
        id
      email
      displayName
      phone
      metafields(first: 10) {
        nodes {
          key
          value
        }
      }
    }
  }
}` as const;

const UPDATE_STATUS = `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
  metafieldsSet(metafields: $metafields) {
    metafields {
      key
      value
    }
    userErrors {
      field
      message
    }
  }
}`;
