import {
  NavLink,
  Outlet,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import PaginationSimple from '~/components/ui/pagination-simple';
import {ProductCard} from '~/components/ui/product-card';
import {Separator} from '~/components/ui/separator';
import {Routes} from '~/lib/constants/routes.constent';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {getCategories} from '../_app/app.server';
import {FilterForm, SortByFilterForm} from './filter-form';
import {getProductFilterList} from './product-filter.server';
import {getProducts} from './product-list.server';
import {useState} from 'react';

export async function loader({params, context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const productList = await getProductList(params, context, request);
  const categories = await getCategories();

  return json({categories, productList});
}
const linkStyles =
  'text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

export default function SubCategoryPage() {
  const pageParam = 'pageNo';
  const [queryParams] = useSearchParams();

  const {categories, productList} = useLoaderData<typeof loader>();
  const {productFilter} = productList;
  const paginationInfo = productList?.results?.pageInfo;

  const [currentPage, setCurrentPage] = useState(
    Number(queryParams.get(pageParam)) || 1,
  );
  console.log('currentPage: ' + currentPage);

  return (
    <section className="container">
      <div className="pt-6 pb-4">
        <BackButton
          title={productList?.results?.formattedData?.categorytitle}
        />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES}>Categories</BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
      <div className="sticky top-0 z-10 flex items-center gap-3 py-4 bg-grey-25">
        {categories?.map((subCategory: any) =>
          subCategory.child_categories?.map((childCategory: any) =>
            childCategory.child_categories?.map((subchildCategory: any) => (
              <NavLink
                key={childCategory.id}
                to={`${Routes.CATEGORIES}/${subchildCategory?.identifier}`}
                className={({isActive, isPending}) =>
                  isPending
                    ? `active__tab ${linkStyles}`
                    : isActive
                    ? `active__tab ${linkStyles}`
                    : linkStyles
                }
              >
                {subchildCategory.title}
              </NavLink>
            )),
          ),
        )}
      </div>
      <Outlet />
      {(productList?.results?.formattedData?.productList?.length > 0 && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <div className="xl:col-span-1">
            <h1 className="sticky top-[100px] bg-neutral-white p-4">
              <FilterForm filterdata={productFilter} />
            </h1>
          </div>

          <div className="xl:col-start-2 xl:col-end-5">
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
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )) || <h1>No products found</h1>}
    </section>
  );
}

const getProductList = async (params: any, context: any, request: any) => {
  try {
    const {searchParams} = new URL(request.url);
    const searchParam = Object.fromEntries(searchParams);
    const searchKey = Object.keys(searchParam);
    let searchList: any = [];
    searchKey.map((value) => {
      searchList.push({key: value, value: searchParams.getAll(value)});
      return {[value]: searchParams.getAll(value)};
    });
    const results = await getProducts(context, params, searchList);
    const productFilter = await getProductFilterList(context);
    return {results, productFilter};
  } catch (error) {
    if (error instanceof Error) {
      console.log('err', error);
      return {};
    }
    return {};
  }
};
