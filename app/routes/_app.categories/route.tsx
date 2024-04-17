import { useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, json } from '@remix-run/server-runtime';
import { AppLoadContext } from '@shopify/remix-oxygen';
import { useEffect, useState } from 'react';
import { BackButton } from '~/components/ui/back-button';
import { useScroll } from '~/hooks/useScroll';
import { getAccessToken, isAuthenticate } from '~/lib/utils/auth-session.server';
import { CategoryCard } from '~/routes/_app.categories/category-card';
import { getCategory } from './categories.server';
import { CSVFileType, UploadCsvFile } from './uploadCSV';
import { getProductList, productBulkCart } from './bulkOrder.server';
import { getMessageSession, messageCommitSession, setErrorMessage, setSuccessMessage } from '~/lib/utils/toast-session.server';

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

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const accessTocken = (await getAccessToken(context)) as string;
  console.log("Action called");
  const messageSession = await getMessageSession(request);
  const contentType = request.headers.get('Content-Type');
  if (contentType === 'application/json') {
    const jsonPayload = (await request.json()) as { stockCode: string; quantity: number; uom: string }[];
    try {
      await productBulkCart(jsonPayload, context, accessTocken, request);
      setSuccessMessage(messageSession, 'Item added to cart successfully');
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        console.log('this is err', error?.message);
        setErrorMessage(messageSession, error?.message);
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
      setErrorMessage(
        messageSession,
        'Item not added to cart. Please try again later.',
      );
      return json(
        {},
        {
          headers: [
            ['Set-Cookie', await context.session.commit({})],
            ['Set-Cookie', await messageCommitSession(messageSession)],
          ],
        },
      );
    }
  }
}

export default function CategoriesPage() {
  const { handleScroll } = useScroll('categories-menu');
  const { categoriesDetail } = useLoaderData<typeof loader>();
  const [csvToArray, setCsvToArray] = useState<CSVFileType[]>([]);

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

  return (
    <>
      <section className="mt-10">
        <div className="container flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
          <BackButton
            className="capitalize"
            title="Categories"
          />
          <UploadCsvFile setCsvToArray={setCsvToArray} />
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
