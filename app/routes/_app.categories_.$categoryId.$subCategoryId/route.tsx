import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {NavLink, Outlet, useLoaderData} from '@remix-run/react';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Separator} from '~/components/ui/separator';
import {CategoryData} from '~/routes/_app.categories/category-data';
import {Routes} from '~/lib/constants/routes.constent';

export async function loader({params}: LoaderFunctionArgs) {
  return json({subCategoryId: params.subCategoryId});
}
const linkStyles =
  'text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none';

export default function SubCategoryPage() {
  const {subCategoryId} = useLoaderData<typeof loader>();

  // This mapping is just for slicing , later we have to fetch the categories data and use it
  const matchingCategory = CategoryData.map((category) => {
    const matchingSubcategory = category.subCategory.find(
      (subCategory) => subCategory.id === subCategoryId,
    );
    return matchingSubcategory
      ? {...category, subCategory: [matchingSubcategory]}
      : null;
  }).filter((category) => category !== null)[0];

  return (
    <section className="container">
      <div className="pt-6 pb-4">
        <BackButton title="MIG WELDERS" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES}>Catgories</BreadcrumbItem>
        </Breadcrumb>
        <Separator className="my-2" />
      </div>
      <div className="flex items-center gap-3 py-4 sticky top-0 z-10 bg-grey-25">
        {matchingCategory?.subCategory.map((subCategory) =>
          subCategory.childCategory.map((childCategory) => (
            <NavLink
              key={childCategory.id}
              to={`${Routes.CATEGORIES}/${matchingCategory.id}/${subCategory.id}/${childCategory.id}`}
              className={({isActive, isPending}) =>
                isPending
                  ? `active__tab ${linkStyles}`
                  : isActive
                  ? `active__tab ${linkStyles}`
                  : linkStyles
              }
            >
              {childCategory.name}
            </NavLink>
          )),
        )}
      </div>
      <Outlet />
    </section>
  );
}
