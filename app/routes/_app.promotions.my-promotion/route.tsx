import React, {FormEvent, useEffect, useState} from 'react';
import {Upload} from 'lucide-react';
import {Button} from '~/components/ui/button';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import PromotionCard from '~/routes/_app.promotions/promotion-card';
import {
  Form,
  Link,
  isRouteErrorResponse,
  json,
  useActionData,
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
import {deletePromotion, exportPromotion} from './my-promotion.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

const PAGE_LIMIT = 9;

const filterOptions = [
  {label: 'Newest To Oldest', value: 'new_to_old'},
  {label: 'Oldest To Newest', value: 'old_to_new'},
  {label: 'Valid', value: 'valid'},
  {label: 'Expired', value: 'expired'},
];

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {searchParams} = new URL(request.url);

  const pageNumber = Math.max(Number(searchParams.get('page')) || 1, 1);

  const filterBy = searchParams.get('filter_by');

  const {userDetails} = await getUserDetails(context);

  const companyId = userDetails.meta.company_id.value;

  const {promotions, totalPromotionCount} = await getPromotions({
    companyId,
    custom: true,
    pageNumber,
    filterBy,
  });

  return json({promotions, totalPromotionCount});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

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

  const buttonName = formData.get('_action') as 'export' | 'delete';

  switch (buttonName) {
    case 'export': {
      const file = await exportPromotion(promotionId);
      return new Response(file, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
    }
    case 'delete': {
      try {
        const response = await deletePromotion(promotionId);

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
    default:
      throw new Error('Invalid Action');
  }
}

export default function MyPromotionsPage() {
  const {promotions, totalPromotionCount} = useLoaderData<typeof loader>();

  const actionData = useActionData<typeof action>();

  console.log({actionData});

  const [checkedCount, setCheckedCount] = useState(0);

  const pageParam = 'page';
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);

  const navigation = useNavigation();

  const submit = useSubmit();

  const isLoading = navigation.state === 'loading';

  const totalPages = Math.ceil(totalPromotionCount / PAGE_LIMIT);

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  const isLoadMoreDisabled = currentPage >= totalPages;

  const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    setCheckedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));
  };
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const promos = searchParams.get('checkedPromos');
    if (
      // promos?.split(',')?.length === 0 ||
      !actionData ||
      !actionData
    ) {
      return;
    }
    const url = window.URL.createObjectURL(
      new Blob([actionData as Blob], {type: 'application/octet-stream'}),
    );
    // const url = window.URL.createObjectURL(
    //   new Blob(['This is a dummy blob!'], {type: 'text/plain'}),
    // );

    console.log('DATA', actionData);

    // Create a temporary <a> element to trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'qwe.png');
    document.body.appendChild(link);
    link.click();
    // Clean up
    () => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    };
  }, [actionData]);

  return (
    <div className="pt-10 sm:pt-0">
      <Form
        method="POST"
        onChange={handleCheckboxChange}
        onSubmit={(event) => {
          submit(event.currentTarget);
          setCheckedCount(0);
        }}
      >
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 pb-6 border-b sm:grid-cols-2 lg:grid-cols-3 border-b-grey-25">
            {promotions.map((promotion: Promotion, index: number) => (
              <div key={promotion.id} className="relative">
                <PromotionCard
                  title={promotion.title}
                  imageURL={promotion.image_url}
                  id={promotion.id}
                  myPromotion={true}
                />
                <input
                  type="checkbox"
                  className="!absolute top-2 right-2 bg-white !rounded-none"
                  name={promotion.title + index}
                  value={promotion.id}
                />
              </div>
            ))}

            <div className="absolute -top-14 inset-x-0 sm:-top-16 sm:right-0 sm:left-auto">
              {checkedCount > 0 ? (
                <div className="flex items-center gap-x-2">
                  <p className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto">
                    {checkedCount} items selected
                  </p>
                  <Button
                    type="submit"
                    name="_action"
                    value="export"
                    variant="primary"
                    className="text-neutral-white basis-full sm:basis-auto"
                  >
                    <Upload className="h-5 w-5" /> Export
                  </Button>
                  <Button
                    type="submit"
                    name="_action"
                    value="delete"
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
          <h1 className="text-center">Promotion unavailable</h1>
        )}
      </Form>

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

      <Form
        method="GET"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
        }}
        className="absolute top-20 inset-x-6 sm:right-6 sm:top-4 sm:left-auto"
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
