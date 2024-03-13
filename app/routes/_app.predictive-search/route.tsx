import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {AppLoadContext} from '@shopify/remix-oxygen';
import {
  PredictiveCollectionFragment,
  PredictiveProductFragment,
  PredictiveQueryFragment,
  PredictiveSearchQuery,
} from 'storefrontapi.generated';
import {isAuthenticate} from '~/lib/utils/auth-session.server';

type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

type PredictiveSearchResultItemPrice =
  | PredictiveProductFragment['variants']['nodes'][0]['price'];

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  price?: PredictiveSearchResultItemPrice;
  styledTitle?: string;
  title: string;
  url: string;
};

type NormalizedPredictiveSearchResults = Array<
  | {type: 'queries'; items: Array<NormalizedPredictiveSearchResultItem>}
  | {type: 'products'; items: Array<NormalizedPredictiveSearchResultItem>}
>;

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
};

const NO_PREDICTIVE_SEARCH_RESULTS: NormalizedPredictiveSearchResults = [
  {type: 'queries', items: []},
  {type: 'products', items: []},
];

/**
 *
 * @description normalize the predictive search results
 * @param predictiveSearch
 */
function normalizePredictiveSearchResults(
  predictiveSearch: PredictiveSearchQuery['predictiveSearch'],
): NormalizedPredictiveSearch {
  const results: NormalizedPredictiveSearchResults = [];

  if (!predictiveSearch) {
    return {
      results: NO_PREDICTIVE_SEARCH_RESULTS,
    };
  }

  if (predictiveSearch.queries.length) {
    results.push({
      type: 'queries',
      items: predictiveSearch.queries.map((query: PredictiveQueryFragment) => {
        return {
          __typename: query.__typename,
          handle: '',
          id: query.text,
          image: undefined,
          title: query.text,
          styledTitle: query.styledText,
          url: '',
        };
      }),
    });
  }

  if (predictiveSearch.products.length) {
    results.push({
      type: 'products',
      items: predictiveSearch.products.map(
        (product: PredictiveProductFragment) => {
          return {
            __typename: product.__typename,
            handle: product.handle,
            id: product.id,
            image: product.variants?.nodes?.[0]?.image,
            title: product.title,
            url: '',
            price: product.variants.nodes[0].price,
          };
        },
      ),
    });
  }

  return {results};
}

async function getSearchProduct({
  limit = 6,
  context,
  searchTerm,
}: {
  searchTerm: string;
  context: AppLoadContext;
  limit?: number;
}) {
  const searchData: PredictiveSearchQuery = await context.storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        limit,
        limitScope: 'EACH',
        searchTerm,
        types: ['PRODUCT', 'QUERY'],
      },
    },
  );

  if (!searchData) {
    throw new Error('No data returned from Shopify API');
  }

  const {results} = normalizePredictiveSearchResults(
    searchData.predictiveSearch,
  );

  return results;
}

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {searchParams} = new URL(request.url);

  const searchTerm = searchParams.get('searchTerm');
  if (searchTerm) {
    const results = await getSearchProduct({searchTerm, context});

    return json({results});
  }
  return null;
}

const PREDICTIVE_SEARCH_QUERY = `#graphql
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
    searchableFields:[VARIANTS_SKU,TITLE,VARIANTS_TITLE]
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
