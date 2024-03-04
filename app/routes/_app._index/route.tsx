import {
  useLoaderData,
  type MetaFunction,
  useRevalidator,
} from '@remix-run/react';
import {json} from '@remix-run/server-runtime';
import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import Carousel from '~/components/ui/carousel';
import CtaHome from '~/components/ui/cta-home';
import DetailChart from '~/components/ui/detailChart';
import ExpenditureCard from '~/components/ui/expenditureCard';
import Profile from '~/components/ui/profile';
import SpendCard from '~/components/ui/spend-card';
import {isAuthenticate} from '~/lib/utils/auth-session.server';
import {getSlides} from '~/routes/_app._index/index.server';
import {
  areaChartData,
  barChartData,
  doughnutChartData,
  lineChartData,
} from '~/routes/_app._index/data-sets';

export const meta: MetaFunction = () => {
  return [{title: 'Cigweld | Home'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const slides = await getSlides({context});

  return json({
    slides,
    areaChartData,
    barChartData,
    lineChartData,
    doughnutChartData,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();

  return (
    <article className="home">
      {data?.slides.length > 0 ? (
        <Carousel images={data?.slides} sectionClass="mt-0" />
      ) : null}
      <Profile sectionClass="mt-10" />
      <CtaHome />
      <SpendCard data={data.areaChartData} />
      <DetailChart
        barChartData={data.barChartData}
        lineChartData={data.lineChartData}
      />
      <ExpenditureCard doughnutChartData={data.doughnutChartData} />
    </article>
  );
}
