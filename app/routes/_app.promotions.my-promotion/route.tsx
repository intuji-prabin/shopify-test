import React, {FormEvent, useState} from 'react';
import {Button} from '~/components/ui/button';
import {MetaFunction} from '@shopify/remix-oxygen';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import PromotionCard from '~/routes/_app.promotions/promotion-card';
import {UploadIcon} from '~/components/icons/upload';
import {
  Form,
  Link,
  NavLink,
  isRouteErrorResponse,
  json,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
  useSubmit,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';
import {deletePromotion} from '~/routes/_app.promotions.my-promotion/my-promotion.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {
  PAGE_LIMIT,
  filterOptions,
} from '~/routes/_app.promotions/promotion-constants';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';

export const meta: MetaFunction = () => {
  return [{title: 'My Promotion'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);
  const {searchParams} = new URL(request.url);
  const paramsList = Object.fromEntries(searchParams);
  const customerId = userDetails?.id;

  const {promotions, totalPromotionCount} = await getPromotions({
    customerId,
    custom: true,
    paramsList,
  });

  return json({promotions, totalPromotionCount});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);
  const customerId = userDetails?.id;

  const messageSession = await getMessageSession(request);

  const formData = await request.formData();

  const formDataObject: Record<string, FormDataEntryValue> = {};

  const promotionId: number[] = [];

  formData.forEach((value, key) => {
    formDataObject[key] = value;
    if (typeof value === 'string' && value !== 'export' && value !== 'delete') {
      promotionId.push(parseInt(value));
    }
  });

  try {
    const response = await deletePromotion(promotionId, customerId);
    if (!response.status) {
      setErrorMessage(messageSession, response.message);
    }

    setSuccessMessage(messageSession, response.message);

    return json(
      {},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  } catch (error) {
    throw new Error('Something went wrong');
  }
}

export default function MyPromotionsPage() {
  const {promotions, totalPromotionCount} = useLoaderData<typeof loader>();

  const [checkedItems, setCheckedItems] = useState<{
    count: number;
    promotions: string[];
  }>({
    count: 0,
    promotions: [],
  });

  const pageParam = 'page';
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get(pageParam) || 1);

  const navigation = useNavigation();

  const submit = useSubmit();

  const isLoading = navigation.state === 'loading';

  const totalPages = Math.ceil(totalPromotionCount / PAGE_LIMIT);

  const nextQuery = new URLSearchParams(searchParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  const isLoadMoreDisabled = currentPage >= totalPages;

  const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const value = target.value;

    setCheckedItems((prevItems) => {
      if (isChecked) {
        return {
          count: prevItems.count + 1,
          promotions: [...prevItems.promotions, value],
        };
      } else {
        return {
          count: prevItems.count - 1,
          promotions: prevItems.promotions.filter(
            (promotion) => promotion !== value,
          ),
        };
      }
    });
  };

  const exportUrl = `${
    ENDPOINT.PROMOTION.BULK_EXPORT
  }?promotion_id=${checkedItems.promotions.join(',')}`;

  return (
    <div className="pt-10 sm:pt-0">
      <Form
        method="POST"
        onChange={handleCheckboxChange}
        onSubmit={(event) => {
          submit(event.currentTarget);
          setCheckedItems({count: 0, promotions: []});
        }}
      >
        {promotions.length > 0 ? (
          <div
            className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25"
            data-cy="promotion-grid"
          >
            {promotions.map((promotion: Promotion, index: number) => (
              <div
                key={promotion.id}
                className="relative"
                data-cy="promotion-card"
              >
                <PromotionCard
                  title={promotion.title}
                  imageURL={promotion.image_url}
                  id={promotion.id}
                  myPromotion={true}
                  expire_at={promotion.expaire_at}
                />
                <input
                  type="checkbox"
                  className="!absolute top-2 right-2 bg-white !rounded-none"
                  name={promotion.title + index}
                  value={promotion.id}
                />
              </div>
            ))}

            <div className="absolute inset-x-0 -top-14 sm:-top-16 sm:right-0 sm:left-auto">
              {checkedItems.count > 0 ? (
                <div className="flex items-center gap-x-2">
                  <p className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto">
                    {checkedItems.count} items selected
                  </p>
                  <NavLink
                    to={exportUrl}
                    reloadDocument
                    className={({isActive, isPending}) =>
                      isPending
                        ? 'bg-red-500'
                        : isActive
                        ? 'active'
                        : 'text-neutral-white font-bold italic uppercase bg-primary-500 disabled:bg-grey-50 px-6 py-2 text-sm leading-6 flex items-center gap-x-1.5'
                    }
                  >
                    <UploadIcon /> Export
                  </NavLink>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="basis-full sm:basis-auto"
                  >
                    Delete
                  </Button>
                </div>
              ) : (
                <p className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto sm:hidden">
                  0 items selected
                </p>
              )}
            </div>
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
      </Form>

      {!isLoadMoreDisabled && (
        <div className="flex justify-center pt-6">
          <Button
            type="button"
            variant="primary"
            size="large"
            className="min-w-64"
            disabled={isLoading}
            data-cy="load-more"
            onClick={() => {
              const params = new URLSearchParams();
              params.set(pageParam, String(currentPage + 1));
              setSearchParams(params, {
                preventScrollReset: true,
              });
            }}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      <Form
        method="GET"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
          setCheckedItems({count: 0, promotions: []});
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <h1 className="text-center uppercase">No data found</h1>
      </section>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex justify-center items-center h-[220px] flex-col gap-2">
        {' '}
        <h4 className="text-center font-bold leading-[29px] text-2xl">
          No promotions found
        </h4>
        <p className="text-lg leading-[22px]">Try editing promotions</p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
