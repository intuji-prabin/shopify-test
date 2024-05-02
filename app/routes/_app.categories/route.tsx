import { useLoaderData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { AppLoadContext } from '@shopify/remix-oxygen';
import { useContext, useEffect } from 'react';
import { BackButton } from '~/components/ui/back-button';
import { BulkCsvUpload } from '~/components/ui/bulk-csv-upload';
import { useScroll } from '~/hooks/useScroll';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { CategoryCard } from '~/routes/_app.categories/category-card';
import { getCategory } from './categories.server';
import { AbilityContext } from '~/lib/helpers/Can';

export async function loader({ context }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const categoriesDetail = await getCategoryList(context);
  if (categoriesDetail && categoriesDetail.length > 0) {
    return json({ categoriesDetail });
  }
  return { categoriesDetail: [] };
}

export interface CategoryType {
  category_id: string;
  title: string;
  description: string;
  imageUrl: string;
  child_categories: {
    id: string;
    title: string;
    identifier: string;
    description: string;
    category_id: string;
    imageUrl: string;
    child_categories: {
      id: string;
      title: string;
      identifier: string;
      description: string;
      category_id: string;
      imageUrl: string;
    }[];
  }[];
  identifier: string;
}

export default function CategoriesPage() {
  const { handleScroll } = useScroll('categories-menu');
  const { categoriesDetail } = useLoaderData<typeof loader>();

  const navigate = useNavigate();
  const ability = useContext(AbilityContext);


  useEffect(() => {
    const handleScroll: EventListener = () => {
      const scrollPos: number =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      const sections: NodeListOf<HTMLDivElement> =
        document.querySelectorAll('.category-wrap');
      const navLinks: NodeListOf<HTMLAnchorElement> =
        document.querySelectorAll('#categories-menu a');
      sections.forEach((section: HTMLDivElement) => {
        const offsetTop: number = section.offsetTop - 125;
        const outerHeight: number = section.offsetHeight;
        if (scrollPos >= offsetTop && scrollPos < offsetTop + outerHeight) {
          const targetClass: string | null = section.getAttribute('id');
          if (targetClass) {
            navLinks.forEach((link: HTMLAnchorElement) =>
              link.classList.remove('active__tab'),
            );
            const targetLink: HTMLAnchorElement | null = document.querySelector(
              `#categories-menu a[href="${targetClass}"]`,
            );
            if (targetLink) {
              targetLink.classList.add('active__tab');
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  if (ability.cannot('view','view_categories')) {
    // Redirect to the previous route
    navigate(-1);
    // You can also specify a specific route to navigate to, such as navigate('/previous-route')
    // navigate('/previous-route');
    return null; // You can return null or any other content indicating redirection is in progress
  }

  return (
    <>
      <section className="mt-10">
        <div className="container flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <BackButton
            className="capitalize"
            title="Categories"
          />
          <BulkCsvUpload action='/bulkCsvUpload' />
        </div>
      </section>
      <section
        id="categories-menu"
        className="container sticky top-0 hidden mt-0 sm:block bg-primary-25"
      >
        {categoriesDetail.length > 0 && (
          <div className="flex items-center gap-3 py-4">
            {categoriesDetail?.map((category) => (
              <a
                href={String(category?.category_id)}
                onClick={(event) => handleScroll(event, category?.category_id ?? '')}
                key={category?.id}
                className="px-5 py-3 text-lg italic font-bold leading-6 text-center uppercase duration-300 border-b-2 cursor-pointer tab__link basis-full border-b-grey-50 bg-grey-50 text-grey-500 hover:bg-none"
              >
                {category?.title}
              </a>
            ))}
          </div>
        )}
      </section>
      {categoriesDetail.length > 0 ? (
        categoriesDetail.map((category) => (
          <CategoryCard key={category?.id} category={category || {} as CategoryType} />
        ))
      ) : (
        <section className="container">
          <h4>NO DATA FOUND</h4>
        </section>
      )}
    </>
  );
}

export const getCategoryList = async (context: AppLoadContext): Promise<{
  id: string;
  title: string;
  identifier: string;
  description: string;
  category_id: string;
  imageUrl: string;
  child_categories: {
    id: string;
    title: string;
    identifier: string;
    description: string;
    category_id: string;
    imageUrl: string;
    child_categories: {
      id: string;
      title: string;
      identifier: string;
      description: string;
      category_id: string;
      imageUrl: string;
    }[];
  }[];
}[]> => {
  try {
    const getCategories = await getCategory(context);
    return getCategories;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error is ', error.message);
      return [];
    }
    console.log('new error', error);
    return [];
  }
};
