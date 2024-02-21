import {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import {Button} from '~/components/ui/button';
import PromotionCard from '~/routes/_app.promotions/promotion-card';
import {
  Form,
  Link,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
  useSubmit,
} from '@remix-run/react';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';
import {MetaFunction} from '@shopify/remix-oxygen';
import {FormEvent} from 'react';
import {
  PAGE_LIMIT,
  filterOptions,
} from '~/routes/_app.promotions/promotion-constants';

export const meta: MetaFunction = () => {
  return [{title: 'Available Promotion'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(context);

  const companyId = userDetails.meta.company_id.value;
  try {
    const {promotions, totalPromotionCount} = await getPromotions({
      companyId,
    });
    return json({promotions, totalPromotionCount});
  } catch (error) {
    throw new Error('promotion unavailable');
  }
}

export default function AvailablePromotionPage() {
  const {promotions, totalPromotionCount} = useLoaderData<typeof loader>();

  console.log(promotions);

  const pageParam = 'page';

  const [queryParams] = useSearchParams();

  const navigation = useNavigation();

  const submit = useSubmit();

  const currentPage = Number(queryParams.get(pageParam) || 1);

  const totalPages = Math.ceil(totalPromotionCount / PAGE_LIMIT);

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  const isLoadMoreDisabled = currentPage >= totalPages;

  const isLoading = navigation.state === 'loading';

  return (
    <div className="pt-6">
      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
          {promotions.map((promotion: Promotion) => (
            <div key={promotion.id}>
              <PromotionCard
                title={promotion.title}
                imageURL={promotion.image_url}
                id={promotion.id}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[220px] flex-col gap-2">
          {' '}
          <h4 className="text-center font-bold leading-[29px] text-2xl">
            No promotions found
          </h4>
          <p className="text-lg leading-[22px]">Try editing promotions</p>
        </div>
      )}

      <div className="flex justify-center pt-6">
        {!isLoadMoreDisabled && (
          <div className="flex justify-center pt-6">
            <Link prefetch="intent" to={`?${nextQuery.toString()}`}>
              <Button
                type="button"
                variant="primary"
                size="large"
                className="min-w-64"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Form
        method="GET"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
        }}
        className="absolute !top-[30px] inset-x-6 sm:right-6 sm:top-4 sm:left-auto"
      >
        <select
          name="filter_by"
          className="w-full !border-grey-100 filter-select"
        >
          {filterOptions.map((filter, index) => (
            <option value={filter.value} key={index + 'filter'}>
              {filter.label}
            </option>
          ))}
        </select>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
