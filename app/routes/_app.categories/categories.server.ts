import {AppLoadContext} from '@shopify/remix-oxygen';

export interface response {
  collections: {
    nodes: nodes[];
  };
}
export interface nodes {
  id: string;
  handle: string;
  title: string;
  description: string;
  parent_handle: {value: string} | {value: null};
  category_id: {value: string};
  image: {value: string};
}

export const getCategory = async (context: AppLoadContext) => {
  const {storefront} = context;
  const catList = await storefront.query(GET_CATEGORY_QUERY);
  const formattedCategories = await formatCategory(catList);
  return formattedCategories;
};

const formatCategory = async (categoryresponse: response) => {
  const items = categoryresponse?.collections?.nodes;
  const finalCategories = items
    .filter((categories) => categories?.parent_handle?.value == 'null')
    .map((parentList) => ({
      id: parentList?.id,
      title: parentList?.title,
      identifier: parentList?.handle,
      description: parentList?.description,
      category_id: parentList?.category_id?.value,
      imageUrl: parentList?.image?.value,
      child_categories: items.some(
        (category) => parentList?.handle == category?.parent_handle?.value,
      )
        ? items
            .filter(
              (category) =>
                parentList?.handle === category?.parent_handle?.value,
            )
            .map((childCategory) => ({
              id: childCategory?.id,
              title: childCategory?.title,
              identifier: childCategory?.handle,
              description: childCategory?.description,
              category_id: childCategory?.category_id?.value,
              imageUrl: childCategory?.image?.value,
              child_categories: items.some(
                (category) =>
                  childCategory?.handle == category?.parent_handle?.value,
              )
                ? items
                    .filter(
                      (category) =>
                        childCategory?.handle ===
                        category?.parent_handle?.value,
                    )
                    .map((child) => ({
                      id: child?.id,
                      title: child?.title,
                      identifier: child?.handle,
                      description: child?.description,
                      category_id: child?.category_id?.value,
                      imageUrl: child?.image?.value,
                    }))
                : [],
            }))
        : [],
    }));
  return finalCategories;
};

const GET_CATEGORY_QUERY = `query getCollection {
    collections(first :  250 ) {
        nodes {
            id
            handle
            title
            description
            parent_handle : metafield( key: "parent_slug" namespace: "parent") { value}
            image : metafield( key: "image_url" namespace: "image_url") { value}
            category_id : metafield( key: "category_id" namespace: "category_id") { value}
        }
    }
    
}` as const;
