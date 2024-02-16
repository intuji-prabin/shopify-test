import {NavLink, Outlet} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {Separator} from '~/components/ui/separator';
import PromotionHeader from '~/routes/_app.promotions/promotion-header';
import {MetaFunction} from '@shopify/remix-oxygen';

export const meta: MetaFunction = () => {
  return [{title: 'Promotions'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);
  return json({});
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
    <>
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
                    ? 'py-2 border-b-2 border-b-transparent'
                    : isActive
                    ? 'py-2 border-b-2 text-primary-500 border-b-primary-500'
                    : 'py-2 border-b-2 border-b-transparent text-grey-400'
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
    </>
  );
};

export default Promotions;
