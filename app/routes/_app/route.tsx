import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import TopHeader from '~/components/ui/layouts/top-header';
import {Payload, getCategories} from './app.server';
import {ActionFunctionArgs, json} from '@remix-run/server-runtime';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toastsession.server';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import MobileNav from '~/components/ui/layouts/mobile-nav';

export async function loader({request}: ActionFunctionArgs) {
  const categories = await getCategories();
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
  categories: Payload[];
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <>
      {matches ? (
        <header>
          <TopHeader />
          <BottomHeader />
        </header>
      ) : (
        <MobileNav />
      )}

      {children}
      <footer className="mt-12">
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
