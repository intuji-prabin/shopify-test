import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import Carousel from '~/components/ui/carousel';
import CtaHome from '~/components/ui/cta-home';
import DetailChart from '~/components/ui/detailChart';
import ExpenditureCard from '~/components/ui/expenditureCard';
import Profile from '~/components/ui/profile';
import SpendCard from '~/components/ui/spend-card';

export const meta: MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader({ request }: LoaderFunctionArgs) {

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const areaChartData = {
    labels,
    datasets: [
      {
        fill: true,
        label: '',
        data: [100, 200, 400, 700, 900, 1000, 1200],
        borderColor: 'rgb(58, 131, 72)',
        backgroundColor: 'rgba(58, 131, 72, 0.5)',
      },
    ],
  };

  const barLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: '2023',
        data: [100, 200, 400, 700, 900, 1000, 1200],
        borderColor: 'rgb(0, 146, 207)',
        backgroundColor: 'rgb(0, 146, 207)',
      },
      {
        label: '2022',
        data: [1000, 300, 100, 350, 100, 200, 300],
        borderColor: 'rgb(200, 162, 0)',
        backgroundColor: 'rgb(200, 162, 0)',
      }
    ],
  };

  const lineChartData = {
    labels: barLabels,
    datasets: [
      {
        label: '2023',
        data: [100, 200, 400, 700, 900, 1000, 1200],
        cubicInterpolationMode: "monotone",
        borderColor: 'rgb(0, 146, 207)',
        borderWidth: 2,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "white",
      },
      {
        label: '2022',
        data: [1000, 300, 100, 350, 100, 200, 300],
        cubicInterpolationMode: "monotone",
        borderColor: 'rgb(200, 162, 0)',
        borderWidth: 2,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "white",
      }
    ],
  };

  return { areaChartData, barChartData, lineChartData };
}

type ImageType = {
  src: string;
  alt: string;
};

const images: ImageType[] = [
  { src: 'https://swiperjs.com/demos/images/nature-3.jpg', alt: 'Nature 3' },
  { src: 'https://swiperjs.com/demos/images/nature-4.jpg', alt: 'Nature 4' },
  { src: 'https://swiperjs.com/demos/images/nature-5.jpg', alt: 'Nature 5' },
  { src: 'https://swiperjs.com/demos/images/nature-6.jpg', alt: 'Nature 6' },
  { src: 'https://swiperjs.com/demos/images/nature-7.jpg', alt: 'Nature 7' },
  { src: 'https://swiperjs.com/demos/images/nature-8.jpg', alt: 'Nature 8' },
  { src: 'https://swiperjs.com/demos/images/nature-9.jpg', alt: 'Nature 9' },
  { src: 'https://swiperjs.com/demos/images/nature-10.jpg', alt: 'Nature 10' },
  { src: 'https://swiperjs.com/demos/images/nature-2.jpg', alt: 'Nature 2' },
];

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <article className="home">
      <Carousel images={images} maxHeight={220} sectionClass='mt-0' />
      <Profile sectionClass='mt-10' />
      <CtaHome />
      <SpendCard data={data.areaChartData} />
      <DetailChart barChartData={data.barChartData} lineChartData={data.lineChartData} />
      <ExpenditureCard />
    </article>
  );
}