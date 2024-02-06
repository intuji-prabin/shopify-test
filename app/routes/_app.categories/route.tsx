import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import { useScroll } from '~/hooks/useScroll';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toastsession.server';
import { CategoryCard } from '~/routes/_app.categories/category-card';
import { Payload, getCategoriesDetail } from './categories.server';
import { useEffect, useState } from 'react';

export async function loader({ request }: ActionFunctionArgs) {
  const categoriesDetail = await getCategoriesDetail();
  const messageSession = await getMessageSession(request);
  if (!categoriesDetail) {
    setErrorMessage(messageSession, "Category List not found");
    return json(
      { categoriesDetail: [] },
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
  return json({ categoriesDetail });
}

export default function CategoriesPage() {
  const { handleScroll } = useScroll('categories-menu');
  const { categoriesDetail } = useLoaderData<typeof loader>();

  useEffect(() => {
    const handleScroll = () => {
      console.log("first")
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <section
        id="categories-menu"
        className="container sticky top-0 hidden sm:block bg-primary-25"
      >
        <h3>Categories</h3>
        {categoriesDetail.length > 0 &&
          <div className="flex items-center gap-3 py-4">
            {categoriesDetail.map((category: Payload) => (
              <a
                href={String(category.id)}
                onClick={(event) => handleScroll(event, category.category_id)}
                key={category.id}
                className="px-5 py-3 text-lg italic font-bold leading-6 text-center uppercase duration-300 border-b-2 cursor-pointer tab__link basis-full border-b-grey-50 bg-grey-50 text-grey-500 hover:bg-none"
              >
                {category.title}
              </a>
            ))}
          </div>
        }
      </section>
      {categoriesDetail.length > 0 ? categoriesDetail.map((category: Payload) => (
        <CategoryCard key={category.id} category={category} />
      )) :
        <section className='container'>
          <h4>NO DATA FOUND</h4>
        </section>}
    </>
  );
}
