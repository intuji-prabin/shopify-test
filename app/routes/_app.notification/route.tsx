import {NavLink, Outlet, useFetcher, useLocation} from '@remix-run/react';
import {BackButton} from '~/components/ui/back-button';
import ClearAllDialouge from './clear-all-dialouge-box';
import {Routes} from '~/lib/constants/routes.constent';
import {Separator} from '~/components/ui/separator';
import {Button} from '~/components/ui/button';
import {LoaderFunctionArgs, redirect} from '@remix-run/server-runtime';
import {isAuthenticate} from '~/lib/utils/auth-session.server';

export type NotificationListItem = {
  id: string;
  date: string;
  news: string;
  orderNo: number;
  customer: string;
};

const routes = [
  {
    link: Routes.NOTIFICATIONS_NEW,
    name: 'New For You',
  },
  {
    link: Routes.NOTIFICATIONS_PREVIOUS,
    name: 'Previous Notifications',
  },
];

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const url = new URL(request.url);

  if (url.pathname === '/notification') {
    return redirect(`${Routes.NOTIFICATIONS_NEW}`);
  }

  return null;
}

export default function route() {
  const location = useLocation();
  const fetcher = useFetcher();

  return (
    <section className="container">
      <div className="flex items-center justify-between">
        <BackButton title="Notifications" />
        {/* <div className="flex items-center gap-2">
          <p className="text-lg font-bold leading-[22px] text-grey-900 italic">
            {news?.length === 1 ? '1 item ' : `${news.length} items `}
          </p>
          <div className="remove-dialogue">
            <ClearAllDialouge handleRemoveAllItems={() => {}} />
          </div>
        </div> */}
      </div>
      <div className="relative p-6 mt-6 bg-neutral-white">
        <div className="flex justify-between items-center">
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
          {location.pathname === Routes.NOTIFICATIONS_NEW && (
            <fetcher.Form method="PUT" action={Routes.NOTIFICATIONS_NEW}>
              <Button
                type="submit"
                variant="link"
                className="before:!bottom-1.5 !px-1"
              >
                mark all as read
              </Button>
            </fetcher.Form>
          )}
        </div>
        <Separator className="mb-6" />
        <Outlet />
      </div>
    </section>
  );
}
