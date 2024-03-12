import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';

export interface TProduct {
  __typename: string;
  id: string;
  title: string;
  handle: string;
  trackingParameters: string;
  collections: Collections;
  variants: Variants;
}

export interface Collections {
  nodes: CollectionsNode[];
}

export interface CollectionsNode {
  id: string;
  handle: string;
  parent_handle: ParentHandle;
}

export interface ParentHandle {
  value: string;
}

export interface Variants {
  nodes: VariantsNode[];
}

export interface VariantsNode {
  id: string;
  image: Image;
  price: Price;
}

export interface Image {
  url: string;
  altText: null;
  width: number;
  height: number;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export const searchProduct = async (
  searchTerm: string,
  context: any,
  limit?: number,
) => {
  const searchData = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      limit: 10,
      limitScope: 'EACH',
      searchTerm,
      types: ['PRODUCT', 'QUERY'],
    },
  });

  if (!searchData) {
    throw new Error('No data returned from Shopify API');
  }

  const data = {
    ...formatData(searchData),
    queries: searchData?.predictiveSearch?.queries,
  };
  return searchData;
};

const SEARCH_QUERY = `#graphql
  fragment PredictiveProduct on Product {
  __typename
  id
  title
  handle
  trackingParameters
  collections(first: 10) {
    nodes {
      id
      handle
      parent_handle: metafield(namespace: "parent", key: "parent_slug") {
        value
      }
    }
  }
  variants(first: 1) {
    nodes {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
}

fragment PredictiveQuery on SearchQuerySuggestion {
  __typename
  text
  styledText
  trackingParameters
}

query predictiveSearch($limit: Int!, $limitScope: PredictiveSearchLimitScope!, $searchTerm: String!, $types: [PredictiveSearchType!]) {
  predictiveSearch(
    limit: $limit
    limitScope: $limitScope
    query: $searchTerm
    types: $types
  ) {
    products {
      ...PredictiveProduct
    }
    queries {
      ...PredictiveQuery
    }
  }
}
` as const;

const formatData = (data: any) => {
  let products: any[] = [];

  if (data?.predictiveSearch?.products) {
    data.predictiveSearch.products.forEach((item: TProduct) => {
      console.log('item', item);

      console.log('collections', item.collections.nodes);

      products.push({
        title: item.title,
        handle: item.handle,
        image: item.variants.nodes[0].image.url,
        price: item.variants.nodes[0].price.amount,
        currencyCode: item.variants.nodes[0].price.currencyCode,
        parent: item.collections.nodes[0].parent_handle.value,
        childCategory: item.collections.nodes[0].handle,
        detailUrl:
          item.collections.nodes[0].parent_handle.value +
          '/' +
          item.collections.nodes[0].handle +
          '/' +
          item.handle,
      });
    });
  }

  console.log('products', products);

  return {products};
};
export async function loader({}: LoaderFunctionArgs) {
  return null;
}

export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const searchTerm = formData.get('searchTerm') as string;

  const results = await searchProduct(searchTerm, context);

  console.log('results', results);

  return json({products: results.products});
}
