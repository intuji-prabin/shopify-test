import { Link, useNavigation } from '@remix-run/react';
import { Routes } from '~/lib/constants/routes.constent';
import Loader from './loader';

export function PageNotFound() {
  const navigation = useNavigation();
  return (
    <div className="container flex items-center justify-center h-screen">
      <figure className="max-w-[660px] flex items-center flex-col justify-center gap-y-6">
        <img src="/page-not-found.png" alt="Page Not Found" />
        <figcaption>
          <h4>
            It seems like we’ve hit a snag in the welding sparks. The Page
            you’re looking for has gone on a brief break, perhaps off for a
            quick weld job.
          </h4>
          <div className="flex items-center justify-center gap-1 py-10">
            <Link to={Routes.HOME} className={`cursor-pointer duration-150 flex items-center justify-center gap-2 uppercase p-2 border-solid text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50 px-6 py-2 text-sm leading-6 w-full sm:w-[unset] font-bold italic ${navigation.state === "loading" && "pointer-events-none opacity-40"}`}>Back TO HOMEPAGE</Link>
            {navigation.state === "loading" && <Loader />}
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
