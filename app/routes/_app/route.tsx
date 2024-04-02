import {
  Outlet,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useSubmit,
} from '@remix-run/react';
import { ActionFunctionArgs, json } from '@remix-run/server-runtime';
import { useEffect } from 'react';
import { useEventSource } from 'remix-utils/sse/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import { HamburgerMenuProvider } from '~/components/ui/layouts/elements/HamburgerMenuContext';
import MobileNav from '~/components/ui/layouts/elements/mobile-navbar/mobile-nav';
import TopHeader from '~/components/ui/layouts/top-header';
import { useMediaQuery } from '~/hooks/useMediaQuery';
import { CART_SESSION_KEY } from '~/lib/constants/cartInfo.constant';
import { Routes } from '~/lib/constants/routes.constent';
import { WISHLIST_SESSION_KEY } from '~/lib/constants/wishlist.constant';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
} from '~/lib/utils/toast-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import { CustomerData } from '../_public.login/login.server';
import {
  getCagetoryList,
  getSessionCart,
  getSessionData
} from './app.server';

export async function loader({ request, context }: ActionFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);
  const sessionData = await getSessionData(userDetails, context)
  const categories = await getCagetoryList(context);
  const messageSession = await getMessageSession(request);
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  const headers = [] as any
  const wishlistSession = await context.session.get(WISHLIST_SESSION_KEY)
  // console.log("werwerew ", wishlistSession);
  if (!sessionCartInfo) {
    sessionCartInfo = await getSessionCart(userDetails?.id, context);
    if (sessionCartInfo) {
      context.session.set(CART_SESSION_KEY, sessionCartInfo);
      headers.push(['Set-Cookie', await context.session.commit({})]);
    }
  }

  if (!categories) {
    setErrorMessage(messageSession, 'Category not found');
    headers.push(['Set-Cookie', await messageCommitSession(messageSession)]);
    // return json(
    //   { categories: [], userDetails, sessionCartInfo },
    //   {
    //     headers: [
    //      ['Set-Cookie', await messageCommitSession(messageSession)]
    //     ],
    //   },
    // );
  }
  return json(
    { categories: categories ? categories : [], userDetails, sessionCartInfo, wishlistSession },
    {
      headers,
    },
  );
}

export default function PublicPageLayout() {
  const { categories, userDetails, sessionCartInfo, wishlistSession } =
    useLoaderData<typeof loader>();

  const submit = useSubmit();

  const cartCount = sessionCartInfo?.lineItems ?? 0;
  const wishlistCount = wishlistSession ?? 0;

  const userId = useEventSource(Routes.LOGOUT_SUBSCRIBE, {
    event: 'logout-event',
  });

  useEffect(() => {
    if (userId === userDetails.id) {
      submit({}, { method: 'POST', action: '/logout' });
    }
  }, [userId]);
  return (
    <Layout
      categories={categories}
      cartCount={cartCount}
      userDetails={userDetails}
      wishlistCount={wishlistCount}
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
  wishlistCount
}: {
  children: React.ReactNode;
  categories: any;
  userDetails: CustomerData;
  cartCount: number;
  wishlistCount: number;
}) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <HamburgerMenuProvider>
      {matches ? (
        <header>
          <TopHeader cartCount={cartCount} userDetails={userDetails} wishlistCount={wishlistCount} />
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
