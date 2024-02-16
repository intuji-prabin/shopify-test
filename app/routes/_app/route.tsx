import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import TopHeader from '~/components/ui/layouts/top-header';
import {Payload, getCagetoryList, getCategories} from './app.server';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toastsession.server';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import {getCategoryList} from '../_app.categories/route';

export async function loader({request, context}: ActionFunctionArgs) {
  // const categories = await getCategories();
  const categories = await getCategoryList(context);
  // const categories = await getCagetoryList( context )
  // console.log("dfdsfsdf ", categories)
  const messageSession = await getMessageSession(request);
  if (!categories) {
    setErrorMessage(messageSession, 'Category not found');
    return json(
      {categories: []},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
  return json({categories});
}

export default function PublicPageLayout() {
  const {categories} = useLoaderData<typeof loader>();

  return (
    <Layout categories={categories}>
      <Outlet />
    </Layout>
  );
}

const Layout = ({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: any;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <>
      {matches ? (
        <header>
          <TopHeader />
          <BottomHeader categories={categories} />
        </header>
      ) : (
        <MobileNav />
      )}
      <div className="mb-12">{children}</div>

      <footer>
        <DesktopFooter />
      </footer>
    </>
  );
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <section className="container">
        <h1 className="text-center uppercase">No data found</h1>
      </section>
    );
  }
}
