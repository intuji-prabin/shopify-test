import {
  Await,
  Link,
  defer,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Expenditure } from '~/components/icons/expenditure';
import Carousel from '~/components/ui/carousel';
import CtaHome from '~/components/ui/cta-home';
import DetailChart from '~/components/ui/detailChart';
import ExpenditureCard from '~/components/ui/expenditureCard';
import Profile from '~/components/ui/profile';
import SpendCard from '~/components/ui/spend-card';
import { Can } from '~/lib/helpers/Can';
import { USER_SESSION_ID, getAccessToken, isAuthenticate, isImpersonating } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import {
  getChartData,
  getExpenditureData,
} from '~/routes/_app._index/data-sets.server';
import { getSlides } from '~/routes/_app._index/index.server';
import { getAllInvoices } from '../_app.invoices/invoices.server';
import { DataTable } from '~/components/ui/data-table';
import { useTable } from '~/hooks/useTable';
import { useColumn } from './use-column';
import { Button } from '~/components/ui/button';
import { Routes } from '~/lib/constants/routes.constent';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ProductTable from './productTable';
import { Separator } from '~/components/ui/separator';
import { getNewNotificationCount } from '../_app/app.server';
import { Handlers, Payload } from '../_app/route';
import { useEventSource } from 'remix-utils/sse/react';
import { EVENTS } from '~/lib/constants/events.contstent';
import { encrypt } from '~/lib/utils/cryptoUtils';

export const meta: MetaFunction = () => {
  return [{ title: 'Cigweld | Home' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { session } = context;

  const { userDetails } = await getUserDetails(request);
  const chartData = getChartData(context, request, userDetails?.id);
  const expenditureData = getExpenditureData(context, request, userDetails?.id);
  const slides = await getSlides({ context });
  const customerId = userDetails.id;
  const userSessionId = session.get(USER_SESSION_ID);

  const { searchParams } = new URL(request.url);

  const { invoiceList } = await getAllInvoices({
    context,
    request,
    customerId,
    searchParams,
  });
  const { totalNotifications } = await getNewNotificationCount({
    context,
    customerId,
    request,
  });

  const impersonateEnableCheck = await isImpersonating(request);
  const sessionAccessTocken = (await getAccessToken(context)) as string;
  const encryptedSession = encrypt(sessionAccessTocken);

  return defer({
    slides,
    userDetails,
    chartData,
    expenditureData,
    invoiceList,
    totalNotifications,
    userSessionId,
    encryptedSession,
    impersonateEnableCheck
  });
}

export default function Homepage() {
  const { slides, chartData,
    expenditureData,
    invoiceList, userDetails,
    totalNotifications,
    userSessionId,
    encryptedSession,
    impersonateEnableCheck
  } = useLoaderData<typeof loader>();
  const { columns } = useColumn(encryptedSession, impersonateEnableCheck);
  const [notificationCounts, setNotificationCounts] = useState(
    totalNotifications | 0,
  );
  const latestFiveInvoices = useMemo(() => {
    return invoiceList.slice(0, 5)
  }, [invoiceList]);

  const { table } = useTable(columns, latestFiveInvoices);

  const hasNotificationBeenUpdated = useEventSource(
    Routes.NOTIFICATIONS_SUBSCRIBE,
    {
      event: EVENTS.NOTIFICATIONS_UPDATED.NAME,
    },
  );

  useEffect(() => {
    if (typeof hasNotificationBeenUpdated === 'string') {
      const parsedData = JSON.parse(hasNotificationBeenUpdated) as {
        notificationData: {
          payload: Payload;
        };
      };
      const { type, totalNumber, companyId, customerId, sessionId, action } =
        parsedData.notificationData.payload;
      const handlers: Handlers = {
        notification: () => {
          const loginCustomerId = userDetails?.id;

          //Here if the action is view and the login customer is the same as the customer id then only notification count will be updated
          if (action === 'view') {
            if (loginCustomerId === customerId) {
              setNotificationCounts(totalNumber);
            } else {
              return;
            }
          }
          else {
            const customer = totalNumber.find((c: { customerId: string; }) => c.customerId === loginCustomerId)
            if (customer) {
              setNotificationCounts(customer.notification);
            }
          }
        },
      };

      const handler = handlers[type];
      if (handler) {
        handler();
      }
    }
  }, [hasNotificationBeenUpdated]);


  return (
    <article className="home">
      {slides.length > 0 ? (
        <Carousel images={slides} sectionClass="mt-0 home-banner" />
      ) : null}
      <Profile profileInfo={userDetails} />
      <CtaHome totalNotificationCount={notificationCounts} />
      <Suspense fallback={<div className='container'>Loading...</div>}>
        <Await resolve={chartData} errorElement={<div></div>}>
          {(resolvedValue) => {
            return (<SpendCard data={resolvedValue?.finalAreaResponse} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div className='container'>Loading...</div>}>
        <Await resolve={chartData} errorElement={<div></div>}>
          {(resolvedValue) => {
            return (<DetailChart barChartData={resolvedValue?.finalBarResponse} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div className='container'>Loading...</div>}>
        <Await resolve={expenditureData} errorElement={<div></div>}>
          {(resolvedValue) => {
            return (<ExpenditureCard brand={resolvedValue?.expenditure_brands} category={resolvedValue?.expenditure_category} currency={resolvedValue?.currency} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div className='container'>Loading...</div>}>
        <Await resolve={expenditureData} errorElement={<div></div>}>
          {(resolvedValue) => {
            return (<ProductTable productList={resolvedValue?.spending_by_product} currency={resolvedValue?.currency} />)
          }}
        </Await>
      </Suspense>
      {latestFiveInvoices.length > 0 &&
        <section className="container">
          <Separator className="mt-6 " />
          <Can I="view" a="view_transaction_history">
            <div className="p-6 mt-6 space-y-3 bg-white mxs:space-y-6">
              <div className='flex flex-wrap justify-between gap-3'>
                <div className="flex items-center gap-x-2 gap-y-1">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                    <Expenditure />
                  </span>
                  <h4>Transaction History</h4>
                </div>
                <Button variant="primary">
                  <Link to={Routes.INVOICES}>view all</Link>
                </Button>
              </div>
              <DataTable table={table} columns={columns} />
            </div>
          </Can>
        </section>
      }
    </article >
  );
}
