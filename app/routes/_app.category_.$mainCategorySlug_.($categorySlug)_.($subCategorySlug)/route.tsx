import {
  isRouteErrorResponse,
  json,
  Link,
  NavLink,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import useEmblaCarousel, {EmblaCarouselType} from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import {LeftArrow} from '~/components/icons/left';
import {AuthError} from '~/components/ui/authError';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {BulkCsvUpload} from '~/components/ui/bulk-csv-upload';
import {PaginationWrapper} from '~/components/ui/pagination-wrapper';
import {ProductCard} from '~/components/ui/product-card';
import {Separator} from '~/components/ui/separator';
import {useConditionalRender} from '~/hooks/useAuthorization';
import {Routes} from '~/lib/constants/routes.constent';
import {getAccessToken, isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getCategoryList} from '../_app.categories/route';
import {addProductToCart} from '../_app.product_.$productSlug/product.server';
import {
  addToWishlist,
  removeFromWishlist,
} from '../_app.product_.$productSlug/wishlist.server';
import {PAGE_LIMIT} from '../_app.promotions/promotion-constants';
import {FilterForm} from './filterForm';
import {getProductFilterList} from './productFilter.server';
import {getProducts} from './productList.server';
import {AuthErrorHandling} from '~/lib/utils/authErrorHandling';

export async function loader({params, context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const {userDetails} = await getUserDetails(request);
  // Filter params
  const {search} = new URL(request.url);
  // Get all the params
  const mainCategorySlug = params?.mainCategorySlug;
  const categorySlug = params?.categorySlug;
  const subCategorySlug = params?.subCategorySlug;
  // Get all the categories for top tab section
  const categories = await getCategoryList(context);
  // Get all the product list
  const slug = subCategorySlug ?? categorySlug ?? '';
  const productDetails = await getProducts({
    context,
    request,
    customerID: userDetails?.id,
    slug,
    filter: search,
  });
  // Get all the product filter list
  const productFilter = await getProductFilterList(context);

  return json({
    mainCategorySlug,
    categorySlug,
    subCategorySlug,
    categories,
    productDetails,
    productFilter,
  });
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const accessTocken = (await getAccessToken(context)) as string;
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  switch (fromData.get('action')) {
    case 'addToCart': {
      try {
        const cartInfo = Object.fromEntries(fromData);
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
    case 'addToWishList': {
      try {
        const productInfo = Object.fromEntries(fromData);
        await addToWishlist(productInfo, context, request);
        setSuccessMessage(
          messageSession,
          'Item added to wishlist successfully',
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
    case 'removeFromWishList': {
      try {
        const productInfo = Object.fromEntries(fromData);
        await removeFromWishlist(productInfo, context, request);
        setSuccessMessage(
          messageSession,
          'Item removed from wishlist successfully',
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
      throw new Error('Unknown action');
    }
  }
};

const linkStyles =
  'text-center basis-full border-b-2 inline-block duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

const ProductListing = () => {
  const {
    mainCategorySlug,
    categorySlug,
    subCategorySlug,
    categories,
    productDetails,
    productFilter,
  } = useLoaderData<typeof loader>();

  // For the breadcrumb back tilte
  const backTitle = subCategorySlug
    ? subCategorySlug?.split('-').join(' ')
    : categorySlug?.split('-').join(' ');

  // For top tab section
  const matchingCategory = categories
    .map((category) => {
      const matchingSubcategory = category.child_categories.find(
        (subCategory) => subCategory.identifier === categorySlug,
      );
      return matchingSubcategory
        ? {...category, subCategory: [matchingSubcategory]}
        : null;
    })
    .filter((category) => category !== null)[0];

  // For carousel at the top
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
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

  // Check if the user has access to view the products
  const shouldRender = useConditionalRender('view_products');
  return (
    shouldRender && (
      <section className="container">
        <div className="flex flex-wrap justify-between gap-2 pt-6">
          <div>
            <BackButton className="capitalize" title={backTitle ?? 'back'} />
            <Breadcrumb>
              <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
                {mainCategorySlug?.split('-').join(' ')}
              </BreadcrumbItem>
              {subCategorySlug && (
                <BreadcrumbItem
                  href={subCategorySlug ? Routes.CATEGORIES : '#'}
                  className={`capitalize ${
                    !subCategorySlug && 'text-grey-800 pointer-events-none'
                  }`}
                >
                  {categorySlug?.split('-').join(' ')}
                </BreadcrumbItem>
              )}
              <BreadcrumbItem className="capitalize text-grey-800">
                {productDetails?.categoryTitle}
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
          <div>
            <BulkCsvUpload action="/bulkCsvUpload" />
          </div>
        </div>
        <Separator className="my-2" />
        <div className="sticky top-0 z-10 bg-primary-25">
          <div className="embla">
            <div className="overflow-x-hidden embla__viewport" ref={emblaRef}>
              <div className="flex gap-3 py-4 embla__container">
                {subCategorySlug
                  ? matchingCategory?.subCategory.map((subCategory) =>
                      subCategory.child_categories.map(
                        (childCategory, index) => (
                          <div
                            className="max-w-full min-w-0 flex-autoCustom embla__slide"
                            key={childCategory.id}
                          >
                            <NavLink
                              to={`/category/${matchingCategory.identifier}/${subCategory?.identifier}/${childCategory?.identifier}`}
                              data-index={index}
                              className={({isActive, isPending}) =>
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
                        ),
                      ),
                    )
                  : matchingCategory?.child_categories
                      .filter(
                        (subCategory) =>
                          subCategory.child_categories.length === 0,
                      )
                      .map((subCategory, index: number) => (
                        <div
                          className="max-w-full min-w-0 flex-autoCustom embla__slide"
                          key={subCategory.id}
                        >
                          <NavLink
                            to={`/category/${matchingCategory.identifier}/${subCategory?.identifier}`}
                            data-index={index}
                            className={({isActive, isPending}) =>
                              isPending
                                ? `active__tab ${linkStyles}`
                                : isActive
                                ? `active__tab ${linkStyles}`
                                : linkStyles
                            }
                          >
                            {subCategory.title}
                          </NavLink>
                        </div>
                      ))}
              </div>
            </div>
            <button
              className={`absolute z-10 flex items-center justify-center w-6 h-auto -translate-y-1/2 cursor-pointer -left-3 embla__button embla__next aspect-square top-1/2 bg-white shadow-md ${
                prevBtnDisabled ? 'hidden' : 'flex'
              }`}
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
            >
              <LeftArrow height={10} fill="#000" />
            </button>
            <button
              className={`absolute z-10 items-center justify-center w-6 h-auto rotate-180 -translate-y-1/2 cursor-pointer -right-3 embla__button embla__prev aspect-square top-1/2 bg-white shadow-md ${
                nextBtnDisabled ? 'hidden' : 'flex'
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
              <FilterForm filterList={productFilter} />
            </div>
          </div>
          <div className="xl:col-start-2 xl:col-end-5">
            {(productDetails?.productList?.length > 0 && (
              <>
                <div className="flex flex-col justify-between gap-2 sm:items-center sm:flex-row">
                  <p className="text-lg text-grey-700">
                    Products found for&nbsp;
                    <span className="font-medium">
                      “ {productDetails?.categoryTitle} ”
                    </span>
                  </p>
                  {/* To Do in Next Version */}
                  {/* <SortByFilterForm /> */}
                </div>
                <div className="grid gap-6 my-6 sm:grid-cols-2 lg:grid-cols-3">
                  {productDetails?.productList.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
                <div>
                  <PaginationWrapper
                    pageSize={PAGE_LIMIT}
                    totalCount={productDetails?.totalProducts}
                  />
                </div>
              </>
            )) || <h1>No products found</h1>}
          </div>
        </div>
      </section>
    )
  );
};

export default ProductListing;

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[calc(100vh_-_140px)] flex justify-center items-center">
        <div className="text-center">
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
          <Link
            to={Routes.CATEGORIES}
            className="mt-3 underline text-primary-500"
          >
            Go to categories
          </Link>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    if (AuthErrorHandling(error.message)) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <div className="min-h-[calc(100vh_-_140px)] flex justify-center items-center">
        <div className="text-center">
          <h1>Opps</h1>
          <p>{error.message}</p>
          <Link
            to={Routes.CATEGORIES}
            className="mt-3 underline text-primary-500"
          >
            Go to categories
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-[calc(100vh_-_140px)] flex justify-center items-center">
        <h1>Unknown Error</h1>
      </div>
    );
  }
}
