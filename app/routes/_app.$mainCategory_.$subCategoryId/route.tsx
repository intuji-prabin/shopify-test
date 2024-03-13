import { NavLink, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { getProductList } from '../_app.$mainCategory.$categoryId_.$subCategoryId/route';
import { getCategoryList } from '../_app.categories/route';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { FilterForm, SortByFilterForm } from '../_app.$mainCategory.$categoryId_.$subCategoryId/filter-form';
import { Separator } from '@radix-ui/react-separator';
import { LeftArrow } from '~/components/icons/left';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { ProductCard } from '~/components/ui/product-card';
import PaginationSimple from '~/components/ui/pagination-simple';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const productList = await getProductList(params, context, request);
  const categories = await getCategoryList(context);

  const mainCategory = params.mainCategory;
  const categoryId = params.subCategoryId;
  return { mainCategory, categoryId, productList, categories };
}

const linkStyles =
  'text-center basis-full border-b-2 inline-block duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

const SubCat = () => {
  const { mainCategory, categoryId, categories, productList } = useLoaderData<any>();
  const { productFilter } = productList;
  const { page } = productList;
  const paginationInfo = productList?.results?.pageInfo;

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

  return (
    <section className="container">
      <div className="pt-6">
        <BackButton
          className="capitalize"
          title={categoryId?.split('-').join(' ') ?? 'Back'}
        />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
            {mainCategory?.split('-').join(' ')}
          </BreadcrumbItem>
          <BreadcrumbItem className="capitalize text-grey-800">
            {categoryId?.split('-').join(' ')}
          </BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
      <div className="sticky top-0 z-10 bg-primary-25">
        <div className="embla">
          <div className="overflow-x-hidden embla__viewport" ref={emblaRef}>
            <div className="flex gap-3 py-4 embla__container">
              {matchingCategory?.child_categories.filter((subCategory: any) => subCategory.child_categories.length === 0).map((subCategory: any, index: number) => (
                <div
                  className="max-w-full min-w-0 flex-autoCustom embla__slide"
                  key={subCategory.id}
                >
                  <NavLink
                    to={`/${matchingCategory.identifier}/${subCategory?.identifier}`}
                    data-index={index}
                    className={({ isActive, isPending }) =>
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
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-4'>
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
                  totalProductLength={
                    productList?.results?.formattedData?.productList?.length
                  }
                  paginationInfo={paginationInfo}
                  page={page}
                />
              </div>
            </>
          )) || <h1>No products found</h1>}
        </div>
      </div>
    </section>
  );
};

export default SubCat;
