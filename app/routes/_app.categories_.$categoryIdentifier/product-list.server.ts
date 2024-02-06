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

export async function getProducts(context, params, companyID) {
  const {storefront} = context;
  const products = await storefront.query(
    query({tag: 'abc12345'}, 'tig-welders'),
  );
  console.log('products', products);
  //   try {
  //     const response = await useFetch<CategoryDetailType>({
  //       method: AllowedHTTPMethods.GET,
  //       url: `${ENDPOINT.CUSTOM.URL}/product/category/detail`,
  //     });
  //     if (!response?.status) {
  //       throw new Error(response?.message);
  //     }
  //     return formattedResponse(response);
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       return [];
  //     }
  //     return [];
  //   }
  return '';
}

const formattedResponse = (response: CategoryDetailType) => {
  if (!response.payload || response.payload.length < 1) {
    return [];
  }

  const data: Payload[] = response.payload.map((item) => ({
    id: item?.id,
    title: item?.title,
    category_id: item?.category_id,
    identifier: item?.identifier,
    description: item?.description,
    imageUrl: item?.imageUrl,
    child_categories: item?.child_categories,
  }));

  return data;
};

const query = (params: any, handler: string) => {
  const produt_query = `query ProductType {
    collection(handle: "${handler}" ) {
          id
          title 
          handle
          products( first: 10, filters: { tag: "abc12345" } ) {
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
