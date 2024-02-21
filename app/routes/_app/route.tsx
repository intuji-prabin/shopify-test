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
import {getUserDetails, isAuthenticate} from '~/lib/utils/authsession.server';
import {CustomerData} from '../_public.login/login.server';

export async function loader({request, context}: ActionFunctionArgs) {
  await isAuthenticate(context);

  const {userDetails} = await getUserDetails(context);

  // const categories = await getCategories();
  const categories = await getCategoryList(context);
  // const categories = await getCagetoryList( context )
  // console.log("dfdsfsdf ", categories)
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

  console.log('userDetails', userDetails);

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
