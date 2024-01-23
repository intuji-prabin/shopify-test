import {AppLoadContext} from '@shopify/remix-oxygen';

type AddTeamParams = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  context: AppLoadContext;
  userRole: string;
};
export async function addTeam({
  address,
  context,
  email,
  fullName,
  userRole,
  phoneNumber,
}: AddTeamParams) {
  const {storefront} = context;
  const firstName = fullName.split(' ')[0];
  const lastName = fullName.split(' ')[1];
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

  if (team.customerCreate.customerUserErrors.length > 0) {
    console.log('error on creating user');
    return;
  }
  return team;
}

const CREATE_TEAM_MUTATION = `# graphql 
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
`;
