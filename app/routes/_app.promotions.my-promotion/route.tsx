import {Form, NavLink, json, useLoaderData, useSubmit} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import React, {FormEvent, useState} from 'react';
import {UploadIcon} from '~/components/icons/upload';
import {Button} from '~/components/ui/button';
import Loader from '~/components/ui/loader';
import {useDownload} from '~/hooks/useDownload';
import {useLoadMore} from '~/hooks/useLoadMore';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {Can} from '~/lib/helpers/Can';
import {
  getAccessToken,
  isAuthenticate,
  isImpersonating,
} from '~/lib/utils/auth-session.server';
import {encrypt} from '~/lib/utils/cryptoUtils';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {deletePromotion} from '~/routes/_app.promotions.my-promotion/my-promotion.server';
import PromotionCard from '~/routes/_app.promotions/promotion-card';
import {filterOptions} from '~/routes/_app.promotions/promotion-constants';
import {
  Promotion,
  getPromotions,
} from '~/routes/_app.promotions/promotion.server';

export const meta: MetaFunction = () => {
  return [{title: 'My Promotion'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);
  const impersonateEnableCheck = await isImpersonating(request);
  const sessionAccessTocken = (await getAccessToken(context)) as string;
  const encryptedSession = encrypt(sessionAccessTocken);

  const {searchParams} = new URL(request.url);

  const paramsList = Object.fromEntries(searchParams);

  const customerId = userDetails?.id;

  const {promotions, totalPromotionCount} = await getPromotions({
    context,
    request,
    customerId,
    custom: true,
    paramsList,
  });

  return json({
    promotions,
    totalPromotionCount,
    impersonateEnableCheck,
    encryptedSession,
  });
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
    const response = await deletePromotion(
      context,
      request,
      promotionId,
      customerId,
    );
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
  const {
    promotions,
    totalPromotionCount,
    impersonateEnableCheck,
    encryptedSession,
  } = useLoaderData<typeof loader>();

  const [checkedPromotions, setCheckedPromotions] = useState<string[]>([]);

  const submit = useSubmit();

  const {isLoading, isLoadMoreDisabled, handleLoadMore} = useLoadMore({
    totalPromotionCount,
  });

  const handleCheckboxChange = (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target as HTMLInputElement;

    const isChecked = target.checked;

    const value = target.value;

    setCheckedPromotions((prevItems: string[]) =>
      isChecked
        ? [...prevItems, value]
        : prevItems.filter((promotion) => promotion !== value),
    );
  };
  const {handleDownload, loading} = useDownload();

  const handleExport = () => {
    const exportUrl = `${
      ENDPOINT.PROMOTION.BULK_EXPORT
    }?promotion_id=${checkedPromotions.join(',')}`;

    handleDownload({
      url: exportUrl,
      headers: {
        Authorization: encryptedSession,
        'Impersonate-Enable': impersonateEnableCheck,
      },
    });
  };

  return (
    <div className="pt-10 sm:pt-0">
      <Form
        method="POST"
        onChange={handleCheckboxChange}
        onSubmit={(event) => {
          submit(event.currentTarget);
          setCheckedPromotions([]);
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
                  defaultChecked={checkedPromotions.includes(
                    promotion.id.toString(),
                  )}
                />
              </div>
            ))}

            <div className="absolute inset-x-0 -top-14 sm:-top-16 sm:right-0 sm:left-auto">
              {checkedPromotions.length > 0 ? (
                <div
                  className="flex items-center gap-x-2"
                  data-cy="item-select-header"
                >
                  <p
                    className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto"
                    data-cy="item-selected"
                  >
                    {checkedPromotions.length}{' '}
                    {checkedPromotions.length > 1 ? 'Items' : 'Item'} selected
                  </p>
                  <Can I="view" a="export_promotions">
                    <Button
                      type="button"
                      onClick={handleExport}
                      className={`${loading && 'pointer-events-none'}`}
                    >
                      {loading ? <Loader /> : <UploadIcon />} Export
                    </Button>
                  </Can>
                  <Can I="view" a="delete_promotions">
                    <Button
                      type="submit"
                      variant="destructive"
                      className="basis-full sm:basis-auto"
                    >
                      Delete
                    </Button>
                  </Can>
                </div>
              ) : (
                <p className="font-bold text-lg leading-5.5 italic basis-full sm:basis-auto sm:hidden">
                  0 Item selected
                </p>
              )}
            </div>
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
            onClick={handleLoadMore}
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      <Form
        method="GET"
        onChange={(event: FormEvent<HTMLFormElement>) => {
          submit(event.currentTarget);
          setCheckedPromotions([]);
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
