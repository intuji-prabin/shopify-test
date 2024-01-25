import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Separator } from '~/components/ui/separator';
import { Routes } from '~/lib/constants/routes.constent';
import { getCategoriesDetail } from '../_app.categories/categories.server';
import { CategoryDataType } from '../_app.categories/route';

export async function loader({ params }: LoaderFunctionArgs) {
  const categoriesDetail = await getCategoriesDetail();
  return json({ categoriesDetail });
}
const linkStyles =
  'text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

export default function SubCategoryPage() {
  const { categoriesDetail } = useLoaderData<typeof loader>();
  return (
    <section className="container">
      <div className="pt-6 pb-4">
        <BackButton title="MIG WELDERS" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES}>Categories</BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
      <div className="flex items-center gap-3 py-4 sticky top-0 z-10 bg-grey-25">
        {categoriesDetail?.map((subCategory: CategoryDataType) =>
          subCategory.child_categories?.map((childCategory) => (
            childCategory.child_categories?.map((subchildCategory) => (
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
    </section>
  );
}
