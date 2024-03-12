import { NavLink, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { Routes } from '~/lib/constants/routes.constent';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getProductList } from '../_app.$mainCategory.$categoryId_.$subCategoryId/route';
import { getCategoryList } from '../_app.categories/route';
import useEmblaCarousel, { EmblaCarouselType } from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { LeftArrow } from '~/components/icons/left';

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const productList = await getProductList(params, context, request);
  const categories = await getCategoryList(context);

  const mainCategory = params.mainCategory;
  const categoryId = params.categoryId;
  return { mainCategory, categoryId, productList, categories };
}

const linkStyles =
  'text-center basis-full border-b-2 inline-block duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

const SubCat = () => {
  const { mainCategory, categoryId, categories } = useLoaderData<any>();
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
              {matchingCategory?.child_categories.map((subCategory: any, index: number) => (
                <div
                  className="max-w-full min-w-0 flex-autoCustom embla__slide"
                  key={subCategory.id}
                >
                  <NavLink
                    to={`/${matchingCategory.identifier}/${subCategory?.identifier}/${subCategory?.identifier}`}
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
    </section>
  );
};

export default SubCat;
