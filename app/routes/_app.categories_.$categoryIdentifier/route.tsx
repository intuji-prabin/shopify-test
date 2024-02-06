import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { Routes } from '~/lib/constants/routes.constent';
import { getCategoriesDetail } from '../_app.categories/categories.server';
import { FilterForm, SortByFilterForm } from './filter-form';
import { ProductCard } from '~/components/ui/product-card';
import { PaginationWrapper } from '~/components/ui/pagination-wrapper';
import { ProductCardData } from './product-card-data';
import { getCustomerDetail } from '../_app.team_.$teamId/edit-team.server';
import { getUserDetails } from '~/lib/utils/authsession.server';
import { getProducts } from './product-list.server';

export async function loader({ params, context }: LoaderFunctionArgs) {
  console.log("first ", params)
  const productList = await getProductList(params, context)
  const categoriesDetail = await getCategoriesDetail();
  return json({ categoriesDetail, productList });
}
const linkStyles =
  'text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

export default function SubCategoryPage() {
  const { categoriesDetail, productList } = useLoaderData<typeof loader>();
  console.log("products ", productList)
  return (
    <section className="container">
      <div className="pt-6 pb-4">
        <BackButton title="MIG WELDERS" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES}>Categories</BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
      <div className="sticky top-0 z-10 flex items-center gap-3 py-4 bg-grey-25">
        {categoriesDetail?.map((subCategory: any) =>
          subCategory.child_categories?.map((childCategory: any) => (
            childCategory.child_categories?.map((subchildCategory: any) => (
              <NavLink
                key={childCategory.id}
                to={`${Routes.CATEGORIES}/${subchildCategory?.identifier}`}
                className={({ isActive, isPending }) =>
                  isPending
                    ? `active__tab ${linkStyles}`
                    : isActive
                      ? `active__tab ${linkStyles}`
                      : linkStyles
                }
              >
                {subchildCategory.title}
              </NavLink>
            ))
          )),
        )}
      </div>
      <Outlet />
      
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <h1 className="sticky top-[100px] bg-neutral-white p-4">
            <FilterForm />
          </h1>
        </div>
        { productList.length > 0 && 
        <div className="col-start-2 col-end-5">
          <SortByFilterForm />
          <div className="grid gap-6 my-6 sm:grid-cols-2 md:grid-cols-3">
            {ProductCardData.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <div className="flex items-center justify-between w-full px-6 py-4 border-t bg-neutral-white">
            <p className="w-40 font-medium text-grey-400">
              1-7 of {ProductCardData.length} Items
            </p>
            <PaginationWrapper pageSize={5} totalCount={ProductCardData.length} />
          </div>
        </div> || <h1>Product not founds</h1> }
      </div> 
    </section>
  );
}


const getProductList = async (params: any, context: any) => {
  try {
    const customerData = await getUserDetails(context)
    console.log("company id", customerData.userDetails.meta.company_id.value)
    const results = await getProducts(context, params, customerData.userDetails.meta.company_id.value)
    return results
  } catch (error) {
    if (error instanceof Error) {
      return [];
    }
    return [];
  }
}
