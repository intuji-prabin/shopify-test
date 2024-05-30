import {
  NavLink,
  Outlet,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import {LoaderFunctionArgs, redirect} from '@remix-run/server-runtime';
import {MetaFunction} from '@shopify/remix-oxygen';
import {RouteError} from '~/components/ui/route-error';
import {Separator} from '~/components/ui/separator';
import {DEFAULT_ERRROR_MESSAGE} from '~/lib/constants/default-error-message.constants';
import {Routes} from '~/lib/constants/routes.constent';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import PromotionHeader from '~/routes/_app.promotions/promotion-header';

export const meta: MetaFunction = () => {
  return [{title: 'Promotions'}];
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const url = new URL(request.url);
  if (url.pathname === '/promotions') {
    return redirect(`${Routes.PROMOTIONS}`);
  }
  return null;
}

const routes = [
  {
    link: '/promotions/available-promotion',
    name: 'Available Promotions',
  },
  {
    link: '/promotions/my-promotion',
    name: 'My Promotions',
  },
];

const Promotions = () => {
  return (
    <section className="container ">
      <PromotionHeader />
      <div className="relative p-6 mt-6 bg-neutral-white">
        <div className="flex items-center space-x-4">
          {routes.map((route) => (
            <NavLink
              key={route.link}
              to={route.link}
              className={({isActive, isPending}) =>
                isPending
                  ? 'py-2 px-4 text-center border-b-[3px] border-b-transparent'
                  : isActive
                  ? 'py-2 px-4 text-center border-b-[3px] text-primary-500 border-b-primary-500'
                  : 'py-2  px-4 text-center border-b-[3px] border-b-transparent text-grey-400'
              }
            >
              {route.name}
            </NavLink>
          ))}
        </div>
        <Separator className="mb-6" />
        <Outlet />
      </div>
    </section>
  );
};

export default Promotions;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <section className="container ">
        <PromotionHeader />
        <RouteError />
      </section>
    );
  } else if (error instanceof Error) {
    return (
      <section className="container ">
        <PromotionHeader />
        <RouteError errorMessage={error.message} />
      </section>
    );
  } else {
    return <h1>{DEFAULT_ERRROR_MESSAGE}</h1>;
  }
}
