import {
  Link,
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
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
  doughnutChartData,
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
import { useMemo } from 'react';

export const meta: MetaFunction = () => {
  return [{ title: 'Cigweld | Home' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);
  const slides = await getSlides({ context });
  const chartData = await getChartData(userDetails?.id);
  const expenditureData = await getExpenditureData(userDetails?.id);
  const customerId = userDetails.id;

  const { searchParams } = new URL(request.url);

  const { invoiceList } = await getAllInvoices({
    customerId,
    searchParams,
  });

  return json({
    slides,
    userDetails,
    chartData,
    doughnutChartData,
    expenditureData,
    invoiceList
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const sliderData = data?.slides;
  const { columns } = useColumn();

  const latestFiveInvoices = useMemo(() => {
    return data?.invoiceList.slice(0, 5)
  }, [data?.invoiceList]);

  const { table } = useTable(columns, latestFiveInvoices);

  return (
    <article className="home">
      {data?.slides.length > 0 ? (
        <Carousel images={sliderData} sectionClass="mt-0 home-banner" />
      ) : null}
      <Profile sectionClass="mt-10" profileInfo={data?.userDetails} />
      <CtaHome />
      {Object.keys(data?.chartData?.finalAreaResponse).length !== 0 && <SpendCard data={data?.chartData?.finalAreaResponse} />}
      {Object.keys(data?.chartData?.finalBarResponse).length !== 0 && <DetailChart
        barChartData={data?.chartData?.finalBarResponse}
      />}
      {Object.keys(data?.expenditureData).length !== 0 && <ExpenditureCard doughnutChartData={data?.expenditureData} />}
      <section className="container">
        <Can I="view" a="view_transaction_history">
          <div className="p-6 space-y-3 bg-white mxs:space-y-6">
            <div className='flex gap-3 flex-wrap justify-between'>
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
    </article>
  );
}
