import { Link } from '@remix-run/react';
import { Routes } from '~/lib/constants/routes.constent';
import { CategoryDataType } from './route';

export function CategoryCard({ category }: { category: CategoryDataType }) {
  const { category_id, title, description, imageUrl, child_categories } = category;
  return (
    <section className="container py-6 mt-0" id={category_id}>
      <div className="grid md:grid-cols-4">
        <div className=" md:col-span-1 bg-grey-50 p-6">
          <figure className="flex flex-wrap">
            <figcaption className="space-y-4 mb-20">
              <h3 className="text-primary-500 uppercase">{title}</h3>
              <p className="text-lg leading-5.5">{description}</p>
            </figcaption>
            <div className="flex justify-center items-center w-full">
              <img src={imageUrl} alt="category-image" />
            </div>
          </figure>
        </div>
        <div className="md:col-start-2 md:col-end-5 grid sm:grid-cols-3 gap-x-6 bg-neutral-white">
          {child_categories?.map((subCategoryItem) => (
            <div className="p-6" key={subCategoryItem.id}>
              <h4 className="mb-4">{subCategoryItem.title}</h4>
              <ul>
                {subCategoryItem?.child_categories?.map(
                  (childCategoryItem) => (
                    <li key={childCategoryItem.id}>
                      <Link
                        to={`${Routes.CATEGORIES}/${childCategoryItem.identifier}`}
                        className="text-base font-medium leading-5.5 text-grey-600 duration-150 hover:text-primary-500"
                      >
                        {childCategoryItem.title}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
