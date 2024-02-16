import {AppLoadContext} from '@shopify/remix-oxygen';

export type ContactUsDataType = {
  service: string;
  imageUrl: string;
  name: string;
  phone: string;
  email: string;
  department: string;
};

export async function getSupportContact({
  context,
}: {
  context: AppLoadContext;
}): Promise<ContactUsDataType[]> {
  const {storefront} = context;
  try {
    const response = await storefront.query(SUPPORT_CONTACT_DATA_QUERY);
    const supportContact = response?.metaobjects?.edges;
    if (supportContact.length < 1) {
      throw new Error(response?.message);
    }
    return formattedResponse(supportContact);
  } catch (e) {
    if (e instanceof Error) {
      return [];
    }
    return [];
  }
}

const formattedResponse = (response: any) => {
  const data = response.map((item: any) => ({
    imageUrl: item?.node?.profile_image?.reference?.previewImage?.url ?? null,
    service: item?.node?.team_position?.value ?? null,
    name: item?.node?.name?.value ?? null,
    phone: item?.node?.phone?.value ?? null,
    email: item?.node?.email?.value ?? null,
    department: item?.node?.department?.value ?? null,
  }));

  return data;
};

const SUPPORT_CONTACT_DATA_QUERY = `query getSUpportContacts {
    metaobjects(type : "cigweld_contact_us", first: 100) {
      edges {
          node {
              team_position : field( key: "cigweld_team_position" ) { value }
              name : field( key: "member_name" ) { value }
              phone : field( key: "phone_number" ) { value }
              email : field( key: "email" ) { value }
              department: field(key: "department") { value }
              profile_image: field(key: "profile_image") { 
                  reference {
                      ... on MediaImage {
                          previewImage {
                              url
                          }
                      }
                  } 
              }
          }
      }
    }
  }` as const;
