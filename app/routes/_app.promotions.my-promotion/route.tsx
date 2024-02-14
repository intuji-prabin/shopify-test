import React, {FormEvent, useEffect, useState} from 'react';
import {Upload} from 'lucide-react';
import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';
import {Button} from '~/components/ui/button';
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
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
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';
import {deletePromotion} from './my-promotion.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toastsession.server';

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {searchParams} = new URL(request.url);

  const pageNumber = Math.max(Number(searchParams.get('page')) || 1, 1);

  const {userDetails} = await getUserDetails(context);

  const companyId = userDetails.meta.company_id.value;

  const {promotions, totalPromotionCount} = await getPromotions({
    companyId,
    custom: true,
    pageNumber,
  });

  return json({promotions, totalPromotionCount});
}

export async function action({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const messageSession = await getMessageSession(request);

  try {
    const response = await deletePromotion(request);

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

const PAGE_LIMIT = 9;

const filterOptions = [
  {label: 'Newest To Oldest', value: 'Newest To Oldest'},
  {label: 'Oldest To Newest', value: 'Oldest To Newest'},
];

export default function MyPromotionsPage() {
  const {promotions, totalPromotionCount} = useLoaderData<typeof loader>();
  const [checkedCount, setCheckedCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const pageParam = 'page';
  const [queryParams] = useSearchParams();
  const currentPage = Number(queryParams.get(pageParam) || 1);

  // const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
  //   const target = event.target as HTMLInputElement;
  //   const isChecked = target.checked;
  //   setCheckedCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));
  // };

  const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;
    const imageURL = target.getAttribute('data-attribute');

    console.log({imageURL});

    if (isChecked) {
      setSelectedImages(
        (prevSelected) => [...prevSelected, imageURL] as string[],
      );
      setCheckedCount((prevCount) => prevCount + 1);
    } else {
      setSelectedImages((prevSelected) =>
        prevSelected.filter((url) => url !== imageURL),
      );
      setCheckedCount((prevCount) => prevCount - 1);
    }
  };
  console.log(selectedImages);

  const handleExportImages = () => {
    // Create a function to download images based on selectedImages array
    selectedImages.forEach((imageUrl) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = 'image.jpg';
      link.click();
    });
  };

  const handleOnchange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log('Selected Date:', selectedValue);
  };
  const navigation = useNavigation();

  const totalPages = Math.ceil(totalPromotionCount / PAGE_LIMIT);

  const nextQuery = new URLSearchParams(queryParams);
  nextQuery.set(pageParam, String(currentPage + 1));

  const isLoadMoreDisabled = currentPage >= totalPages;

  const submit = useSubmit();

  return (
    <div className="pt-10 sm:pt-0">
      <Form method="POST" onChange={handleCheckboxChange}>
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
              <input
                type="hidden"
                value={promotion.image_url}
                data-attribute={promotion.image_url}
              />
            </div>
          ))}
          {checkedCount > 0 && (
            <div className="absolute -top-14 inset-x-0 sm:-top-16 sm:right-0 sm:left-auto">
              <div className="flex items-center gap-x-2">
                <p className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto">
                  {checkedCount} items selected
                </p>
                <Button
                  type="button"
                  variant="primary"
                  className="text-neutral-white basis-full sm:basis-auto"
                >
                  <Upload className="h-5 w-5" /> Export
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="basis-full sm:basis-auto"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
      </Form>
      {!isLoadMoreDisabled && (
        <div className="flex justify-center pt-6">
          <Link prefetch="intent" to={`?${nextQuery.toString()}`}>
            <Button
              type="button"
              variant="primary"
              size="large"
              className="min-w-64"
            >
              {navigation.state === 'loading' ? 'Loading...' : 'Load More'}
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
        <select name="filter" className="w-full !border-grey-100 filter-select">
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
