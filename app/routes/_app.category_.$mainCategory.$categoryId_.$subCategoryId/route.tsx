import {
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import PaginationSimple from '~/components/ui/pagination-simple';
import { ProductCard } from '~/components/ui/product-card';
import { Separator } from '~/components/ui/separator';
import { Routes } from '~/lib/constants/routes.constent';
import { getCategoryList } from '../_app.categories/route';
import { FilterForm, SortByFilterForm } from './filter-form';
import { getProductFilterList } from './product-filter.server';
import { getProducts } from './product-list.server';
import { useCallback, useEffect, useState } from 'react';
import { LeftArrow } from '~/components/icons/left';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import { addProductToCart } from '../_app.product_.$productSlug/product.server';
import { getFilterProduct } from './filter.server';
import { WISHLIST_SESSION_KEY } from '~/lib/constants/wishlist.constant';
import { addToWishlist, removeFromWishlist } from '../_app.product_.$productSlug/wishlist.server';
import { Button } from '~/components/ui/button';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const productList = await getProductList(params, context, request);
  const categories = await getCategoryList(context);
  const sessionWishListInfo = await context.session.get(WISHLIST_SESSION_KEY);

  const categoryId = params.categoryId;
  const subCategoryId = params.subCategoryId;
  const mainCategory = params.mainCategory;
  return json({
    categories,
    productList,
    categoryId,
    subCategoryId,
    mainCategory,
    sessionWishListInfo,
  }, { headers: [['Set-Cookie', await context.session.commit({})]] });
}

export const action = async ({
  request,
  context,
}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  switch (fromData.get("action")) {
    case "addToCart": {
      try {
        const cartInfo = Object.fromEntries(fromData);
        const accessTocken = (await getAccessToken(context)) as string;
        const addToCart = await addProductToCart(
          cartInfo,
          accessTocken,
          context,
          request,
        );
        setSuccessMessage(messageSession, 'Item added to cart successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not added to cart. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    case "addToWishList": {
      try {
        const productInfo = Object.fromEntries(fromData);
        await addToWishlist(productInfo, context, request);
        setSuccessMessage(messageSession, 'Item added to wishlist successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not added to wishlist. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    case "removeFromWishList": {
      try {
        const productInfo = Object.fromEntries(fromData);
        await removeFromWishlist(productInfo, context, request);
        setSuccessMessage(messageSession, 'Item removed from wishlist successfully');
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not removed from the wishlist. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    default: {
      throw new Error("Unknown action");
    }
  }
};


const linkStyles =
  'text-center basis-full border-b-2 inline-block duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

const PAGE_LIMIT = 9;

export default function SubCategoryPage() {
  const { categories, productList, categoryId, subCategoryId, mainCategory, sessionWishListInfo } =
    useLoaderData<typeof loader>();
  console.log("rdfffsfd ", productList)
  const { page } = productList;
  const paginationInfo = productList?.results?.pageInfo;
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const { productFilter } = productList;

  const matchingCategory = categories
    .map((category) => {
      const matchingSubcategory = category.child_categories.find(
        (subCategory) => subCategory.identifier === categoryId,
      );
      return matchingSubcategory
        ? { ...category, subCategory: [matchingSubcategory] }
        : null;
    })
    .filter((category) => category !== null)[0];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: 'trimSnaps',
  });
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const activeTab = document.querySelector('.active__tab');
    const dataIndex = activeTab?.getAttribute('data-index');
    emblaApi.scrollTo(Number(dataIndex) || 0);
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  console.log("productList?.results?.formattedData.productList", productList?.results?.formattedData.productList)
  return (
    <section className="container">
      <div className="flex flex-wrap justify-between pt-6">
        <div>
          <BackButton
            className="capitalize"
            title={subCategoryId?.split('-').join(' ') ?? 'Back'}
          />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
              {mainCategory?.split('-').join(' ')}
            </BreadcrumbItem>
            <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
              {categoryId?.split('-').join(' ')}
            </BreadcrumbItem>
            <BreadcrumbItem className="capitalize text-grey-800">
              {subCategoryId?.split('-').join(' ')}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div>
          <Button>upload order</Button>
        </div>
      </div>
      <Separator className="my-2" />
      <div className="sticky top-0 z-10 bg-primary-25">
        <div className="embla">
          <div className="overflow-x-hidden embla__viewport" ref={emblaRef}>
            <div className="flex gap-3 py-4 embla__container">
              {matchingCategory?.subCategory.map((subCategory) =>
                subCategory.child_categories.map((childCategory, index) => (
                  <div
                    className="max-w-full min-w-0 flex-autoCustom embla__slide"
                    key={childCategory.id}
                  >
                    <NavLink
                      to={`/category/${matchingCategory.identifier}/${subCategory?.identifier}/${childCategory?.identifier}`}
                      data-index={index}
                      className={({ isActive, isPending }) =>
                        isPending
                          ? `active__tab ${linkStyles}`
                          : isActive
                            ? `active__tab ${linkStyles}`
                            : linkStyles
                      }
                    >
                      {childCategory.title}
                    </NavLink>
                  </div>
                )),
              )}
            </div>
          </div>
          <button
            className={`absolute z-10 flex items-center justify-center w-6 h-auto -translate-y-1/2 cursor-pointer -left-3 embla__button embla__next aspect-square top-1/2 bg-white shadow-md ${prevBtnDisabled ? 'hidden' : 'flex'
              }`}
            onClick={scrollPrev}
            disabled={prevBtnDisabled}
          >
            <LeftArrow height={10} fill="#000" />
          </button>
          <button
            className={`absolute z-10 items-center justify-center w-6 h-auto rotate-180 -translate-y-1/2 cursor-pointer -right-3 embla__button embla__prev aspect-square top-1/2 bg-white shadow-md ${nextBtnDisabled ? 'hidden' : 'flex'
              }`}
            onClick={scrollNext}
            disabled={nextBtnDisabled}
          >
            <LeftArrow height={10} fill="#000" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1">
          <div className="sticky top-[100px] bg-neutral-white">
            <FilterForm filterdata={productFilter} />
          </div>
        </div>
        <div className="xl:col-start-2 xl:col-end-5">
          {(productList?.results?.formattedData?.productList?.length > 0 && (
            <>
              <div className="flex flex-col justify-between gap-2 sm:items-center sm:flex-row">
                <p className="text-lg text-grey-700">
                  Products found for{' '}
                  <span className="font-medium">
                    “ {productList?.results?.formattedData?.categorytitle} ”
                  </span>
                </p>
                <SortByFilterForm />
              </div>
              <div className="grid gap-6 my-6 sm:grid-cols-2 lg:grid-cols-3">
                {productList?.results?.formattedData.productList?.map(
                  (product: any, index: any) => (
                    <ProductCard key={index} {...product} />
                  ),
                )}
              </div>
              <div className="flex flex-col justify-start w-full gap-3 px-6 py-4 border-t sm:items-center sm:justify-between sm:flex-row bg-neutral-white">
                <PaginationSimple
                  totalLength={
                    productList?.results?.formattedData?.productList?.length
                  }
                  paginationInfo={paginationInfo}
                  page={page}
                  pageSize={PAGE_LIMIT}
                />
              </div>
            </>
          )) || <h1>No products found</h1>}
        </div>
      </div>
    </section>
  );
}

export const getProductList = async (
  params: any,
  context: any,
  request: Request,
) => {
  try {
    const { searchParams } = new URL(request.url);
    const searchParam = Object.fromEntries(searchParams);
    const pageInfo = searchParams.get('pageNo');
    const { userDetails } = await getUserDetails(request);

    let page = 1;
    if (pageInfo) {
      page = parseInt(pageInfo);
    }

    const searchKey = Object.keys(searchParam);
    let searchList: any = [];

    searchKey.map((value) => {
      searchList.push({ key: value, value: searchParams.getAll(value) });
      return { [value]: searchParams.getAll(value) };
    });

    let results;
    if (searchList.length > 0) {
      results = await getFilterProduct(
        context,
        params,
        searchList,
        userDetails?.id,
      );
    } else {
      results = await getProducts(
        context,
        params,
        searchList,
        userDetails?.id,
        [],
        true,
      );
    }

    const productFilter = await getProductFilterList(context);
    return { productFilter, results, page };
  } catch (error) {
    if (error instanceof Error) {
      console.log('err', error);
      return {};
    }
    return {};
  }
};

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
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>Something went wrong</p>
        </div>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
