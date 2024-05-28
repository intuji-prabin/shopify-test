import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  scales,
} from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { ClientOnly } from 'remix-utils/client-only';
import useDate from '~/hooks/useDate';
import { ArrowDown, ArrowUp } from './arrow';
import { Can } from '~/lib/helpers/Can';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  scales,
);

export const options = {
  responsive: true,
  scales: {
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
    x: {
      display: true,
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    tooltips: {
      enabled: false,
    },
    legend: {
      display: false,
    },
  },
};

const SpendCard = ({ data }: { data: any }) => {
  const currentDate = useDate();
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Can I="view" a="view_monthly_spending">
          <div className="p-6 space-y-8 bg-white">
            <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
              <h4>Monthly Spend</h4>
              <p className="text-base font-medium lg:text-lg text-grey-900 mxs:text-right">
                {currentDate.currentLongMonth}
              </p>
            </div>
            <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-3">
              <div className="space-y-2">
                <h4 className="text-grey-900">{data?.monthly?.currency} <span className="text-5xl italic font-bold">{data?.monthly?.amount}</span></h4>
                <p className="flex items-center text-lg font-medium gap-1.5">{data?.monthly?.increment ? <ArrowUp /> : <ArrowDown />}<span className={
                  data?.monthly?.increment ? "text-semantic-success-500" : "text-semantic-danger-500"}> {data?.monthly?.percentage}% </span>VS LAST MONTH</p>
              </div>
              <div className="md:w-72 md:ml-auto">
                <ClientOnly fallback={<Fallback />}>
                  {() => <Line options={options} data={data?.monthly?.areaChartData} />}
                </ClientOnly>
              </div>
            </div>
          </div>
        </Can>
        <Can I="view" a="view_total_spending">
          <div className="p-6 space-y-8 bg-white">
            <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
              <h4>Total Spend (Year-to-Date) </h4>
              <ul className="text-base font-medium lg:text-lg text-grey-900 mxs:text-right">
                <li>
                  Jan 1 - {currentDate.currentDate}{' '}
                  {currentDate.currentLongMonth} {currentDate.currentYear}
                </li>
                <li className="text-sm font-normal mxs:text-right">
                  ({currentDate.daysIntoYear} Days into the year)
                </li>
              </ul>
            </div>
            <div className="grid items-center grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-3">
              <div className="space-y-2">
                <h4 className="text-grey-900">{data?.ytd?.currency} <span className="text-5xl italic font-bold">{data?.ytd?.amount}</span></h4>
                <p className="flex items-center text-lg font-medium gap-1.5">{data?.ytd?.increment ? <ArrowUp /> : <ArrowDown />}<span className={
                  data?.ytd?.increment ? "text-semantic-success-500" : "text-semantic-danger-500"}> {data?.ytd?.percentage}% </span>VS LAST YEAR</p>
              </div>
              <div className="md:w-72 md:ml-auto">
                <ClientOnly fallback={<Fallback />}>
                  {() => <Line options={options} data={data?.ytd?.areaChartData} />}
                </ClientOnly>
              </div>
            </div>
          </div>
        </Can>
      </div>
    </section>
  );
};

export default SpendCard;

function Fallback() {
  return <div>Generating Chart</div>;
}
