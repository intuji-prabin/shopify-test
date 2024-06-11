import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { Button } from '~/components/ui/button';
import PromotionCard from '~/routes/_app.promotions/promotion-card';
import {
  Form,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
  useSubmit,
} from '@remix-run/react';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';
import { MetaFunction } from '@shopify/remix-oxygen';
import { FormEvent } from 'react';
import { filterOptions } from '~/routes/_app.promotions/promotion-constants';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { useLoadMore } from '~/hooks/useLoadMore';

export const meta: MetaFunction = () => {
  return [{ title: 'Available Promotion' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);
  const { searchParams } = new URL(request.url);
  const paramsList = Object.fromEntries(searchParams);
  const customerId = userDetails?.id;

  try {
    const { promotions, totalPromotionCount } = await getPromotions({
      request,
      customerId,
      paramsList,
    });
    return json({ promotions, totalPromotionCount });
  } catch (error) {
    throw new Error('promotion unavailable');
  }
}

export default function AvailablePromotionPage() {
  const { promotions, totalPromotionCount } = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const { isLoading, handleLoadMore, isLoadMoreDisabled } = useLoadMore({
    totalPromotionCount,
  });

  return (
    <div className="pt-10 sm:pt-0">
      {promotions.length > 0 ? (
        <div
          className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25 "
          data-cy="promotion-grid"
        >
          {promotions.map((promotion: Promotion) => (
            <div key={promotion.id} data-cy="promotion-card">
              <PromotionCard
                title={promotion.title}
                imageURL={promotion.image_url}
                id={promotion.id}
                expire_at={promotion.expaire_at}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-[220px] flex-col gap-2">
          {' '}
          <h4
            className="text-center font-bold leading-[29px] text-2xl"
            data-cy="not-found"
          >
            No promotions found
          </h4>
        </div>
      )}
      <div className="flex justify-center pt-6">
        {!isLoadMoreDisabled && (
          <div className="flex justify-center pt-6">
            <Button
              type="button"
              variant="primary"
              size="large"
              className="min-w-64"
              disabled={isLoading}
              data-cy="load-more"
              onClick={handleLoadMore}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>

      <Form
        method="GET"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
        }}
        className="absolute top-20 inset-x-6 sm:right-6 sm:top-[30px] sm:left-auto pl-0 sm:pl-6 bg-white"
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
