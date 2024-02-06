import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

export interface CategoryDetailType {
  status: boolean;
  message: string;
  payload: Payload[];
}

export interface Payload {
  id: number;
  title: string;
  category_id: string;
  identifier: string;
  description: null | string;
  imageUrl: string;
  child_categories: Payload[];
}

export async function getProducts(context : any, params : any, companyID: any) {
  const {storefront} = context;
  const { categoryIdentifier } = params
  const brand = "intuji test"
  let filterData = `{tag: "${ companyID }" }`

  if( brand ) {
    filterData = filterData + ` { productVendor: "${brand}" }`
  }

  filterData = `[ ${filterData} ]`

  const products = await storefront.query(
    query(filterData, categoryIdentifier),
  );

  const formateData = formattedResponse( products )
  
  return formateData
}

const formattedResponse = (response: any) => {
  if( !response?.collection ) {
    return []
  }

  if( response?.collection?.products?.edges.length < 1 ) {
    return []
  }
  const productList = response?.collection?.products?.edges

  const finalProductList : any = productList.map((item : any ) => ({
    title : item?.node?.title,
    variants : productVariantDataFromate(item?.node?.variants)
  }));

  return finalProductList
};

const productVariantDataFromate = ( variant : any ) => {
  if( variant?.edges.length < 1) {}
  
  const finalVariantData =  {
    sku : variant?.edges[0]?.node?.sku
  }
  return finalVariantData
}

const query = (filterList: any, handler: string) => {
  
  const produt_query = `query ProductType {
    collection(handle: "${handler}" ) {
          id
          title 
          handle
          products( first: 10, filters: ${filterList} ) {
              edges {
                  node {
                      handle
                      id
                      title
                      variants(first:2) {
                          edges {
                              node {
                                  sku
                              }
                          }
                      }
                  }
              }
          }
        }
        
      }`;
  return produt_query;
};
const STOREFRONT_PRODUCT_GET_QUERY = `query ProductType {
    collection(handle: "tig-welders") {
      id
      title 
      handle
      products( first:10, filters: { tag: "123"}) {
          edges {
              node {
                  handle
                  id
                  title
                  variants(first:2) {
                      edges {
                          node {
                              sku
                          }
                      }
                  }
              }
          }
      }
    }
    
  }` as const;
