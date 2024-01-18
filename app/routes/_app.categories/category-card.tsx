import {Link} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {CategoryDataType} from '~/routes/_app.categories/category-data';

export function CategoryCard({category}: {category: CategoryDataType}) {
  const {id, name, description, imageUrl, subCategory} = category;
  return (
    <section className="container py-6" id={id}>
      <div className="grid md:grid-cols-4">
        <div className=" md:col-span-1 bg-grey-50 p-6">
          <figure className="flex flex-wrap">
            <figcaption className="flex flex-col items-center space-y-4 mb-20">
              <h3 className="text-primary-500 uppercase">{name}</h3>
              <p className="text-lg leading-5.5">{description}</p>
            </figcaption>
            <div className="flex justify-center items-center w-full">
              <img src={imageUrl} alt="category-image" />
            </div>
          </figure>
        </div>
        <div className="md:col-start-2 md:col-end-5 grid sm:grid-cols-3 gap-x-6 bg-neutral-white">
          {subCategory.map((subCategoryItem, index) => (
            <div className="p-6" key={index}>
              <h4 className="mb-4">{subCategoryItem.name}</h4>
              <ul>
                {subCategoryItem.childCategory.map(
                  (childCategoryItem, index) => (
                    <li key={index}>
                      <Link
                        to={`${Routes.CATEGORIES}/${id}/${subCategoryItem.id}/${childCategoryItem.id}`}
                        className="text-base font-medium leading-5.5 text-grey-600 duration-150 hover:text-primary-500"
                      >
                        {childCategoryItem.name}
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
