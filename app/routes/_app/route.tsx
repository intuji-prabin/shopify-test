import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSubmit,
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
} from '~/lib/utils/toast-session.server';
import {useMediaQuery} from '~/hooks/useMediaQuery';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import {useEffect} from 'react';
import {useEventSource} from 'remix-utils/sse/react';
import {getCategoryList} from '../_app.categories/route';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {CustomerData} from '../_public.login/login.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {HamburgerMenuProvider} from '~/components/ui/layouts/elements/HamburgerMenuContext';
import {Routes} from '~/lib/constants/routes.constent';

export async function loader({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(request);

  const categories = await getCagetoryList(context);

  const messageSession = await getMessageSession(request);

  if (!categories) {
    setErrorMessage(messageSession, 'Category not found');
    return json(
      {categories: [], userDetails},
      {
        headers: {
          'Set-Cookie': await messageCommitSession(messageSession),
        },
      },
    );
  }
  return json({categories, userDetails});
}

export default function PublicPageLayout() {
  const {categories, userDetails} = useLoaderData<typeof loader>();

  const cartCount = 2001;

  const submit = useSubmit();

  const userId = useEventSource(Routes.LOGOUT_SUBSCRIBE, {
    event: 'logout-event',
  });

  useEffect(() => {
    if (userId === userDetails.id) {
      submit({}, {method: 'POST', action: '/logout'});
    }
  }, [userId]);

  return (
    <Layout
      categories={categories}
      cartCount={cartCount}
      userDetails={userDetails}
    >
      <Outlet />
    </Layout>
  );
}

const Layout = ({
  children,
  categories,
  userDetails,
  cartCount,
}: {
  children: React.ReactNode;
  categories: any;
  userDetails: CustomerData;
  cartCount: number;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <HamburgerMenuProvider>
      {matches ? (
        <header>
          <TopHeader cartCount={cartCount} userDetails={userDetails} />
          <BottomHeader categories={categories} />
        </header>
      ) : (
        <MobileNav />
      )}
      <div className="mb-12">{children}</div>

      <footer>
        <DesktopFooter />
      </footer>
    </HamburgerMenuProvider>
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
