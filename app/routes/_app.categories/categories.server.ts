export const getCategory = async (context: any) => {
  const {storefront} = context;
  const catList = await storefront.query(GET_CATEGORY_QUERY);
  const formattedCategories = await formatCategory(catList);
  return formattedCategories;
};

const formatCategory = (categoryresponse: any) => {
  const items = categoryresponse?.collections?.nodes;
  const finalCategories = items
    .filter((categories: any) => categories?.parent_handle?.value == 'null')
    .map((parentList: any) => ({
      id: parentList?.id,
      title: parentList?.title,
      identifier: parentList?.handle,
      description: parentList?.description,
      category_id: parentList?.category_id?.value,
      imageUrl: parentList?.image?.value,
      child_categories: items.some(
        (category: any) => parentList?.handle == category?.parent_handle?.value,
      )
        ? items
            .filter(
              (category: any) =>
                parentList?.handle === category?.parent_handle?.value,
            )
            .map((childCategory: any) => ({
              id: childCategory?.id,
              title: childCategory?.title,
              identifier: childCategory?.handle,
              description: childCategory?.description,
              category_id: childCategory?.category_id?.value,
              imageUrl: childCategory?.image?.value,
              child_categories: items.some(
                (category: any) =>
                  childCategory?.handle == category?.parent_handle?.value,
              )
                ? items
                    .filter(
                      (category: any) =>
                        childCategory?.handle ===
                        category?.parent_handle?.value,
                    )
                    .map((child: any) => ({
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
