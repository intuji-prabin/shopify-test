import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import TopHeader from '~/components/ui/layouts/top-header';
import { Payload, getCagetoryList, getCategories } from './app.server';
import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import { getCategoryList } from '../_app.categories/route';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { CustomerData } from '../_public.login/login.server';
import { getUserDetails } from '~/lib/utils/user-session.server';

export async function loader({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);

  const { userDetails } = await getUserDetails(request);
  const categories = await getCagetoryList(context);
  const messageSession = await getMessageSession(request);
  if (!categories) {
    setErrorMessage(messageSession, 'Category not found');
    return json(
      { categories: [], userDetails },
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
  return json({ categories, userDetails });
}

export default function PublicPageLayout() {
  const { categories, userDetails } = useLoaderData<typeof loader>();

  return (
    <Layout categories={categories} userDetails={userDetails}>
      <Outlet />
    </Layout>
  );
}

const Layout = ({
  children,
  categories,
  userDetails,
}: {
  children: React.ReactNode;
  categories: any;
  userDetails: CustomerData;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <>
      {matches ? (
        <header>
          <TopHeader userDetails={userDetails} />
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
