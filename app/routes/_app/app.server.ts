import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface CategoriesType {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number | string;
  title: string;
  identifier: string;
  child_categories?: Payload[];
}

export async function getCategories() {
  try {
    const response = await useFetch<CategoriesType>({
      method: AllowedHTTPMethods.GET,
      url: ENDPOINT.CATEGORY.GET,
    });
    if (!response?.status) {
      throw new Error(response?.message);
    }
    return formattedResponse(response);
  } catch (e) {
    if (e instanceof Error) {
      return [];
    }
    return [];
  }
}

const formattedResponse = (response: CategoriesType) => {
  if (!response.payload || response.payload.length < 1) {
    return [];
  }

  const data: Payload[] = response.payload.map((item) => ({
    id: item?.id,
    title: item?.title,
    identifier: item?.identifier,
    child_categories: item?.child_categories,
  }));

  return data;
};

export const getCagetoryList = async ( context : any ) => {
  try {

      const {storefront} = context;
      const catList = await storefront.query(GET_CATEGORY_QUEYR)
      const formateCategories = await formateCategory( catList )
      return formateCategories
  } catch( error ) {
      if( error instanceof Error ) {
          console.log("error is ", error.message)
          return []
      }
      console.log("new error", error )
      return []
  }

}

const formateCategory = async ( categoryesponse : any ) => {
  const items = categoryesponse?.collections?.nodes
  const finalCategories = await items.filter(( categories : any  ) => categories?.parent_handle?.value == "null" ).map( ( parentList : any ) => ({
      id          : parseInt( parentList?.id.replace("gid://shopify/Collection/", "") ),
      title       : parentList?.title,
      identifier  : parentList?.handle,
      child_categories: items.some( ( category : any ) => parentList?.handle == category?.parent_handle?.value ) ? items.filter( ( category : any ) => parentList?.handle === category?.parent_handle?.value).map((childCategory : any) => (
          {
              id          : parseInt( childCategory?.id.replace("gid://shopify/Collection/", "") ),
              title       : childCategory?.title,
              identifier  : childCategory?.handle,
              child_categories: items.some( (category : any ) => childCategory?.handle == category?.parent_handle?.value) ? items.filter( ( category : any ) => childCategory?.handle === category?.parent_handle?.value).map((child : any) => (
                  {
                      id          : parseInt( child?.id.replace("gid://shopify/Collection/", "") ),
                      title       : child?.title,
                      identifier  : child?.handle,
                      child_categories : []
                  }
              )) : []
          }
      )) : []
  }))
  return finalCategories
}

const GET_CATEGORY_QUEYR = `query getCollection {
  collections(first :  250 ) {
      nodes {
          id
          handle
          title
          parent_handle : metafield( key: "parent_slug" namespace: "parent") { value}
      }
  }
  
}`  as const;
