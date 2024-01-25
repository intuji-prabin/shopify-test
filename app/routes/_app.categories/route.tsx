import { useScroll } from '~/hooks/useScroll';
import { CategoryCard } from '~/routes/_app.categories/category-card';
import { getCategoriesDetail } from './categories.server';
import { json } from '@remix-run/server-runtime';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
  const categoriesDetail = await getCategoriesDetail();
  return json({ categoriesDetail });
}

export interface CategoryDataType {
  id: number;
  title: string;
  category_id: string;
  identifier: string;
  description: null | string;
  imageUrl?: string;
  child_categories?: CategoryDataType[];
}

export default function CategoriesPage() {
  const { handleScroll } = useScroll('categories-menu');
  const { categoriesDetail } = useLoaderData<typeof loader>();

  return (
    <>
      <section
        id="categories-menu"
        className="container hidden sm:block sticky top-0 bg-primary-25"
      >
        <h3>Categories</h3>
        <div className="flex items-center gap-3 py-4">
          {categoriesDetail.map((category: CategoryDataType) => (
            <a
              onClick={(event) => handleScroll(event, category.category_id)}
              key={category.id}
              className="tab__link text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none"
            >
              {category.title}
            </a>
          ))}
        </div>
      </section>
      {categoriesDetail.map((category: CategoryDataType) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </>
  );
}
