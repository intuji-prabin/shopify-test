import {Link, Outlet} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';

/**
 * @description layout for unprotected page
 */
export default function PublicPageLayout() {
  return (
    <section className="flex items-center justify-center min-h-screen mx-auto">
      <div className="flex flex-col gap-y-[103px] items-center p-4">
        <Link to={Routes.HOME}>
          <figure>
            <img src="logo_main.svg" alt="Logo" />
          </figure>
        </Link>
        <Outlet />
        <div>
          <p className="mb-2 italic font-bold text-center">Contact Support</p>
          <p className="text-center">
            Don't have an account? Contact Support for assistance.
          </p>
        </div>
      </div>
    </section>
  );
}
