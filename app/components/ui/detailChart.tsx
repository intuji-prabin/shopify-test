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
import { useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { ClientOnly } from 'remix-utils/client-only';
import { Dollar } from '../icons/dollar';
import { ArrowDown, ArrowUp } from './arrow';
import Expenditure from './expenditure';
import ExpenditureTab from './expenditure-tab';
import { Separator } from './separator';
import ChartFallback from './chartFallback';
import { Can } from '~/lib/helpers/Can';
import { Invoicing } from '../icons/invoicing';

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

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      align: 'end' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 40,
        font: {
          size: 14,
          family: "Barlow Condensed, sans-serif",
          weight: 500,
        },
      },
      reverse: true,
      onHover: (event: any) => {
        event.chart.canvas.style.cursor = "pointer";
      },
    },
    title: {
      display: false,
      text: "Total Spending YTD",
      align: "start" as const,
      font: {
        family: "Barlow Condensed, sans-serif",
        style: "italic" as const,
        size: 24,
        weight: "bold" as const,
      },
      color: "#0F1010",
    },
  },
  scales: {
    y: {
      grace: 20,
      grid: {},
      border: {
        display: false,
        dash: [5, 5],
        dashOffset: 5,
      },
      ticks: {
        callback: function (value: any) {
          value = value + "K";
          return value;
        },
        stepSize: 90,
        font: {
          size: 14,
          family: "Barlow Condensed, sans-serif",
          weight: 500,
        },
      },
    },
    x: {
      grid: {
        display: false,
        drawBorder: false,
        drawOnChartArea: false,
        dashOffset: 5,
      },
      border: {
        display: false,
      },
      ticks: {
        font: {
          size: 14,
          family: "Barlow Condensed, sans-serif",
          weight: 500,
        },
      },
    },
  },
};

const DetailChart = ({
  barChartData,
}: {
  barChartData: any;
}) => {
  const [activeTab, setActiveTab] = useState("ytd");
  const [activeInvoiceTab, setActiveInvoiceTab] = useState("ytd");
  const dynamicDates = [{ 'ytd': 'Year-To-Date' }, { 'qtd': 'Quarter-To-Date' }, { 'mtd': 'Month-To-Date' }];

  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {barChartData?.totalSpend &&
          <Can I="view" a="view_total_spending">
            <div className="p-6 space-y-3 bg-white mxs:space-y-6">
              <div className="flex flex-col items-start gap-3 sm:items-center sm:flex-row">
                <div className="w-full mxs:grow mxs:w-auto">
                  <div className="flex items-center gap-x-2 gap-y-1">
                    <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                      <Dollar />
                    </span>
                    <h4>Total Spend</h4>
                  </div>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[280px]">
                  <div className="grid grid-cols-3 gap-1 p-[3px] border border-solid border-grey-50">
                    <ExpenditureTab dynamicDates={dynamicDates} setActiveTab={setActiveTab} activeTab={activeTab} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-x-3 gap-y-6 sm:flex-row sm:flex-wrap">
                <div className="w-full sm:grow sm:w-auto">
                  <Expenditure expenditureData={barChartData?.totalSpend[activeTab]} activeTab={activeTab} />
                </div>
                <div className="w-full sm:text-right sm:ml-auto sm:w-auto">
                  <p className='flex items-center gap-x-1.5 sm:justify-end text-lg font-medium'>{barChartData?.totalSpend[activeTab]?.increment ? <ArrowUp /> : <ArrowDown />}<span className={
                    barChartData?.totalSpend[activeTab]?.increment ? "text-semantic-success-500" : "text-semantic-danger-500"}> {barChartData?.totalSpend[activeTab]?.percentage}% </span></p>
                  <p className='text-lg font-medium uppercase text-grey-500'>VS LAST {activeTab}</p>
                </div>
              </div>
              <Separator />
              <div className="overflow-x-auto">
                <div className="min-w-[580px] min-h-[290px]">
                  <h4>Total Spending <span className='uppercase'>{activeTab}</span></h4>
                  <ClientOnly fallback={<ChartFallback />}>
                    {() => <Bar options={options} data={barChartData?.totalSpend[activeTab]?.barChartData} />}
                  </ClientOnly>
                </div>
              </div>
            </div>
          </Can>
        }
        {barChartData?.totalInvoicing &&
          <Can I="view" a="view_total_invoicing">
            <div className="p-6 space-y-3 bg-white mxs:space-y-6">
              <div className="flex flex-col items-start gap-3 sm:items-center sm:flex-row">
                <div className="w-full mxs:grow mxs:w-auto">
                  <div className="flex items-center gap-x-2 gap-y-1">
                    <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                      <Invoicing />
                    </span>
                    <h4>Total Invoicing</h4>
                  </div>
                </div>
                <div className="w-full sm:w-auto sm:min-w-[280px]">
                  <div className="grid grid-cols-3 gap-1 p-[3px] border border-solid border-grey-50">
                    <ExpenditureTab dynamicDates={dynamicDates} setActiveTab={setActiveInvoiceTab} activeTab={activeInvoiceTab} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-x-3 gap-y-6 sm:flex-row sm:flex-wrap">
                <div className="w-full sm:grow sm:w-auto">
                  <Expenditure expenditureData={barChartData?.totalInvoicing[activeInvoiceTab]} activeTab={activeInvoiceTab} />
                </div>
                <div className="w-full sm:text-right sm:ml-auto sm:w-auto">
                  <p className='flex items-center gap-x-1.5 sm:justify-end text-lg font-medium'>{barChartData?.totalInvoicing[activeInvoiceTab]?.increment ? <ArrowUp /> : <ArrowDown />}<span className={
                    barChartData?.totalInvoicing[activeInvoiceTab]?.increment ? "text-semantic-success-500" : "text-semantic-danger-500"}> {barChartData?.totalInvoicing[activeInvoiceTab]?.percentage}% </span></p>
                  <p className='text-lg font-medium uppercase text-grey-500'>VS LAST {activeInvoiceTab}</p>
                </div>
              </div>
              <Separator />
              <div className="overflow-x-auto">
                <div className="min-w-[580px] min-h-[290px]">
                  <h4>Total Invoicing <span className='uppercase'>{activeInvoiceTab}</span></h4>
                  <ClientOnly fallback={<ChartFallback />}>
                    {() => <Line options={options} data={barChartData?.totalInvoicing[activeInvoiceTab]?.lineChartData} />}
                  </ClientOnly>
                </div>
              </div>
            </div>
          </Can>
        }
      </div>
    </section>
  );
};

export default DetailChart;
