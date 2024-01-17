import {Separator} from '~/components/ui/separator';
import {useScroll} from '~/hooks/useScroll';
import {CategoryCard} from '~/routes/_app.categories/category-card';
import {CategoryData} from '~/routes/_app.categories/category-data';

export default function CategoriesPage() {
  const {handleScroll} = useScroll('categories-menu');

  return (
    <>
      <section
        id="categories-menu"
        className="container hidden sm:block sticky top-0 bg-primary-25"
      >
        <h3>Categories</h3>
        <Separator className="mb-2" />
        <div className="flex items-center gap-3 py-4">
          {CategoryData.map((category) => (
            <a
              onClick={(event) => handleScroll(event, category.id)}
              key={category.id}
              className="tab__link text-center basis-full border-b-2 duration-300 border-b-grey-50 cursor-pointer bg-grey-50 uppercase text-lg italic font-bold leading-6 text-grey-500 py-3 px-5 hover:bg-none"
            >
              {category.name}
            </a>
          ))}
        </div>
      </section>
      {CategoryData.map((category, index) => (
        <CategoryCard key={index} category={category} />
      ))}
    </>
  );
}
