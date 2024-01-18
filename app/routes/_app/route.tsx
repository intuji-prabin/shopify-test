import { Outlet } from '@remix-run/react';
import BottomHeader from '~/components/ui/layouts/bottom-header';
import DesktopFooter from '~/components/ui/layouts/desktopFooter';
import TopHeader from '~/components/ui/layouts/top-header';

/**
 * @description layout for protected page
 */

export default function PublicPageLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      {/* <header>
        <TopHeader />
        <BottomHeader />
      </header> */}
      {children}
      {/* <footer className="mt-12">
        <DesktopFooter />
      </footer> */}
    </>
  );
};
