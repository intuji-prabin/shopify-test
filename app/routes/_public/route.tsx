import {Outlet} from '@remix-run/react';

/**
 * @description layout for unprotected page
 */
export default function PublicPageLayout() {
  return (
    <section className="flex items-center justify-center h-screen mx-auto">
      <div className="flex flex-col gap-y-[103px] items-center p-4">
        <figure>
          <img src="logo_main.svg" alt="" />
        </figure>
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
