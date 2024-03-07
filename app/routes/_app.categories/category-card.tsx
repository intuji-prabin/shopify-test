import { Link } from '@remix-run/react';

export function CategoryCard({ category }: { category: any }) {
  const {
    category_id,
    title,
    description,
    imageUrl,
    child_categories,
    identifier,
  } = category;
  return (
    <section className="container pt-6 mt-0 category-wrap" id={category_id}>
      <div className="grid md:grid-cols-4">
        <div className="p-6 md:col-span-1 bg-grey-50">
          <figure className="flex flex-col flex-wrap justify-between h-full">
            <figcaption className="mb-20 space-y-4">
              <h3 className="uppercase text-primary-500">{title}</h3>
              <p className="text-lg leading-5.5">{description}</p>
            </figcaption>
            <div className="flex items-center justify-center w-full">
              <img src={imageUrl} alt="category-image" />
            </div>
          </figure>
        </div>
        <div className="grid md:col-start-2 md:col-end-5 sm:grid-cols-3 gap-x-6 bg-neutral-white">
          {child_categories?.map((subCategoryItem) => (
            <div className="p-6" key={subCategoryItem.id}>
              {subCategoryItem?.child_categories?.length > 0 ?
                <h4 className="mb-4">{subCategoryItem.title}</h4> :
                <h4 className="mb-4 text-primary-500"><Link to={`/${identifier}/${subCategoryItem?.identifier}`}>{subCategoryItem.title}</Link></h4>
              }
              <ul>
                {subCategoryItem?.child_categories?.map((childCategoryItem) => (
                  <li key={childCategoryItem.id}>
                    <Link
                      to={`/${identifier}/${subCategoryItem.identifier}/${childCategoryItem.identifier}`}
                      className="text-base font-medium leading-5.5 text-grey-600 duration-150 hover:text-primary-500"
                    >
                      {childCategoryItem.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
