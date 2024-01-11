import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Filler,
  Tooltip,
  scales,
} from 'chart.js/auto';
import {Line} from 'react-chartjs-2';
import {ClientOnly} from 'remix-utils/client-only';
import {ArrowUp, ArrowDown} from './arrow';

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

const getOrdinal = (day: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const getDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const day = today.getDate();
  const ordinalDay = getOrdinal(day);
  const options: Intl.DateTimeFormatOptions = {month: 'short'};
  const monthString: string = today.toLocaleString('en-US', options);
  const januaryFirst = new Date(today.getFullYear(), 0, 1);
  const differenceInDays = Math.floor(
    (today.getTime() - januaryFirst.getTime()) / (24 * 60 * 60 * 1000),
  );
  return `<li>Jan 1 - ${ordinalDay} ${monthString} ${year}</li><li class='text-sm font-normal text-right'>(${differenceInDays} Days into the year)</li>`;
};

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
      display: false,
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
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

const SpendCard = () => {
  const currentDate = getDate();
  console.log(data);
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 space-y-8 bg-white">
          <div className="flex flex-wrap justify-between gap-3">
            <h4>Monthly Spend</h4>
            <p className="text-base font-medium lg:text-lg text-grey-900">
              December
            </p>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <div className="space-y-2">
              <h4 className="text-grey-900">
                $ <span className="text-5xl italic font-bold">89.57 </span>K
              </h4>
              <p className="flex items-center text-lg font-medium gap-1.5">
                <ArrowUp />
                <span className=" text-semantic-success-500"> 8.5% </span>VS
                LAST MONTH
              </p>
            </div>
            <div className="w-48">
              <ClientOnly fallback={<Fallback />}>
                {() => <Line options={options} data={data} />}
              </ClientOnly>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-8 bg-white">
          <div className="flex flex-wrap justify-between gap-3">
            <h4>Total Spend (Year-to-Date) </h4>
            <ul
              className="text-base font-medium lg:text-lg text-grey-900"
              dangerouslySetInnerHTML={{
                __html: currentDate,
              }}
            ></ul>
          </div>
          <div className="flex flex-wrap justify-between gap-3">
            <div className="space-y-2">
              <h4 className="text-grey-900">
                $ <span className="text-5xl italic font-bold">89.57 </span>K
              </h4>
              <p className="flex items-center text-lg font-medium gap-1.5">
                <ArrowDown />
                <span className=" text-semantic-danger-500"> 8.5% </span>VS LAST
                MONTH
              </p>
            </div>
            <div className="w-48">
              <ClientOnly fallback={<Fallback />}>
                {() => <Line options={options} data={data} />}
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpendCard;

function Fallback() {
  return <div>Generating Chart</div>;
}
