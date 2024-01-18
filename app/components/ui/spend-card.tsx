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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  scales
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
      display: false,
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
      display: false
    },
  },
};


const SpendCard = ({ data }: { data: any }) => {
  const currentDate = useDate();
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 space-y-8 bg-white">
          <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
            <h4>Monthly Spend</h4>
            <p className="text-base font-medium lg:text-lg text-grey-900 mxs:text-right">{currentDate.currentLongMonth}</p>
          </div>
          <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
            <div className="space-y-2">
              <h4 className="text-grey-900">$ <span className="text-5xl italic font-bold">89.57 </span>K</h4>
              <p className="flex items-center text-lg font-medium gap-1.5"><ArrowUp /><span className=" text-semantic-success-500"> 8.5% </span>VS LAST MONTH</p>
            </div>
            <div className="mxs:w-48 mxs:ml-auto">
              <ClientOnly fallback={<Fallback />}>
                {() => <Line options={options} data={data} />}
              </ClientOnly>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-8 bg-white">
          <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
            <h4>Total Spend (Year-to-Date) </h4>
            <ul className="text-base font-medium lg:text-lg text-grey-900 mxs:text-right">
              <li>Jan 1 - {currentDate.currentDate} {currentDate.currentLongMonth} {currentDate.currentYear}</li>
              <li className='text-sm font-normal mxs:text-right'>({currentDate.daysIntoYear} Days into the year)</li>
            </ul>
          </div>
          <div className="grid items-center grid-cols-1 mxs:grid-cols-2 gap-y-1 gap-x-3">
            <div className="space-y-2">
              <h4 className="text-grey-900">$ <span className="text-5xl italic font-bold">89.57 </span>K</h4>
              <p className="flex items-center text-lg font-medium gap-1.5"><ArrowDown /><span className=" text-semantic-danger-500"> 8.5% </span>VS LAST MONTH</p>
            </div>
            <div className="mxs:w-48 mxs:ml-auto">
              <ClientOnly fallback={<Fallback />}>
                {() => <Line options={options} data={data} />}
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SpendCard;

function Fallback() {
  return <div>Generating Chart</div>;
}