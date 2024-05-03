import {
  useLoaderData,
  type MetaFunction,
} from '@remix-run/react';
import { json } from '@remix-run/server-runtime';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import Carousel from '~/components/ui/carousel';
import CtaHome from '~/components/ui/cta-home';
import DetailChart from '~/components/ui/detailChart';
import ExpenditureCard from '~/components/ui/expenditureCard';
import Profile from '~/components/ui/profile';
import SpendCard from '~/components/ui/spend-card';
import { isAuthenticate } from '~/lib/utils/auth-session.server';
import { getUserDetails } from '~/lib/utils/user-session.server';
import {
  areaChartData,
  barChartData,
  doughnutChartData,
  lineChartData,
} from '~/routes/_app._index/data-sets';
import { getSlides } from '~/routes/_app._index/index.server';

export const meta: MetaFunction = () => {
  return [{ title: 'Cigweld | Home' }];
};

export async function loader({ context, request }: LoaderFunctionArgs) {
  await isAuthenticate(context);
  const { userDetails } = await getUserDetails(request);
  const slides = await getSlides({ context });

  return json({
    slides,
    userDetails,
    areaChartData,
    barChartData,
    lineChartData,
    doughnutChartData,
  });
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  const sliderData = data?.slides;

  return (
    <article className="home">
      {data?.slides.length > 0 ? (
        <Carousel images={sliderData} sectionClass="mt-0 home-banner" />
      ) : null}
      <Profile sectionClass="mt-10" profileInfo={data?.userDetails} />
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
