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
import { isAuthenticate } from '~/lib/utils/auth-session.server';
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
import { Suspense, useMemo } from 'react';
import ProductTable from './productTable';
import { Separator } from '~/components/ui/separator';
import { getNewNotificationCount } from '../_app/app.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Cigweld | Home' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);
  const chartData = getChartData(userDetails?.id);
  const expenditureData = getExpenditureData(userDetails?.id);
  const slides = await getSlides({ context });
  const customerId = userDetails.id;

  const { searchParams } = new URL(request.url);

  const { invoiceList } = await getAllInvoices({
    customerId,
    searchParams,
  });
  const { totalNotifications } = await getNewNotificationCount({
    customerId,
    request,
  });

  return defer({
    slides,
    userDetails,
    chartData,
    expenditureData,
    invoiceList,
    totalNotifications
  });
}

export default function Homepage() {
  const { slides, chartData,
    expenditureData,
    invoiceList, userDetails
  } = useLoaderData<typeof loader>();
  // const sliderData = data?.slides;
  const { columns } = useColumn();

  const latestFiveInvoices = useMemo(() => {
    return invoiceList.slice(0, 5)
  }, [invoiceList]);

  const { table } = useTable(columns, latestFiveInvoices);

  return (
    <article className="home">
      {slides.length > 0 ? (
        <Carousel images={slides} sectionClass="mt-0 home-banner" />
      ) : null}
      <Profile sectionClass="mt-10" profileInfo={userDetails} />
      <CtaHome totalNotificationCount={data?.totalNotifications} />
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={chartData} errorElement={<div className='container'>Error occurred</div>}>
          {(resolvedValue) => {
            return (<SpendCard data={resolvedValue?.finalAreaResponse} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={chartData} errorElement={<div className='container'>Error occurred</div>}>
          {(resolvedValue) => {
            return (<DetailChart barChartData={resolvedValue?.finalBarResponse} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={expenditureData} errorElement={<div className='container'>Error occurred</div>}>
          {(resolvedValue) => {
            return (<ExpenditureCard doughnutChartData={resolvedValue?.expenditureData} currency={resolvedValue?.expenditureData?.currency} />)
          }}
        </Await>
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={chartData} errorElement={<div className='container'>Error occurred</div>}>
          {(resolvedValue) => {
            return (<ProductTable productList={resolvedValue?.expenditureData?.spending_by_product} currency={resolvedValue?.expenditureData?.currency} />)
          }}
        </Await>
      </Suspense>
      {/* {Object.keys(data?.chartData?.finalAreaResponse)?.length !== 0 && <SpendCard data={data?.chartData?.finalAreaResponse} />}
      {Object.keys(data?.chartData?.finalBarResponse)?.length !== 0 && <DetailChart
        barChartData={data?.chartData?.finalBarResponse}
      />} */}
      {/* {Object.keys(data?.expenditureData).length !== 0 && <ExpenditureCard doughnutChartData={data?.expenditureData} currency={data?.expenditureData?.currency} />} */}
      {/* {data?.expenditureData?.spending_by_product?.length > 0 &&
        <ProductTable productList={data?.expenditureData?.spending_by_product} currency={data?.expenditureData?.currency} />
      } */}
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
