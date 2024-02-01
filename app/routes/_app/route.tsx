import { Outlet, useLoaderData } from '@remix-run/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import TopHeader from '~/components/ui/layouts/top-header';
import { getCategories } from './add-product-megamenu-server';
import { json } from '@remix-run/server-runtime';

export interface CategoriesType {
  id: number;
  title: string;
  identifier: string;
  child_categories?: CategoriesType[];
}

export async function loader() {
  try {
    const categories = await getCategories();
    return json({ categories });
  } catch (error) {
    return json({ categories: [] });
  }
}

/**
 * @description layout for protected page
 */

export default function PublicPageLayout() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <Layout categories={categories}>
      <Outlet />
    </Layout>
  );
}

const Layout = ({ children, categories }: { children: any; categories: CategoriesType }) => {
  return (
    <>
      <header>
        <TopHeader />
        <BottomHeader categories={categories} />
      </header>
      {children}
      <footer className="mt-12">
        <DesktopFooter />
      </footer>
    </>
  );
};
