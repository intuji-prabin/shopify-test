import {NavLink, Outlet} from '@remix-run/react';
import {LoaderFunctionArgs, json} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/authsession.server';
import {Separator} from '~/components/ui/separator';
import PromotionHeader from '~/routes/_app.promotions/promotion-header';

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
        <div className="relative ">
          <PromotionHeader />
          <div className="p-6 bg-neutral-white mt-6">
            <div className="py-1.5">
              {routes.map((route) => (
                <NavLink
                  key={route.link}
                  to={route.link}
                  className={({isActive, isPending}) =>
                    isPending
                      ? 'px-4 py-2'
                      : isActive
                      ? 'px-4 py-2 border-b-2 text-primary-500 border-b-primary-500'
                      : 'px-4 py-2 text-grey-400'
                  }
                >
                  {route.name}
                </NavLink>
              ))}
            </div>
            <Separator />
            <Outlet />
          </div>
        </div>
      </section>
    </>
  );
};

export default Promotions;
