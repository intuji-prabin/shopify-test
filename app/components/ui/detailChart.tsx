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
import { Bar, Line } from 'react-chartjs-2';
import { ClientOnly } from 'remix-utils/client-only';
import { Dollar } from '../icons/dollar';
import { ArrowUp } from './arrow';
import Expenditure from './expenditure';
import ExpenditureTab from './expenditure-tab';
import { Separator } from './separator';

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
            display: true,
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

const DetailChart = ({ barChartData, lineChartData }: { barChartData: any, lineChartData: any }) => {

    const dynamicDates = ['Year-To-Date', 'Quarter-To-Date', 'Month-To-Date'];

    return (
        <section className="container">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                    <div className='flex flex-col items-start gap-3 sm:items-center sm:flex-row'>
                        <div className='w-full mxs:grow mxs:w-auto'>
                            <div className="flex items-center gap-x-2 gap-y-1">
                                <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                    <Dollar />
                                </span>
                                <h4>Total Spend</h4>
                            </div>
                        </div>
                        <div className='w-full sm:w-auto sm:min-w-[280px]'>
                            <div className='grid grid-cols-3 gap-1 p-[3px] border border-solid border-grey-50'>
                                <ExpenditureTab dynamicDates={dynamicDates} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-x-3 gap-y-6 sm:flex-row'>
                        <div className='w-full sm:grow sm:w-auto'>
                            <Expenditure />
                        </div>
                        <div className='w-full sm:text-right sm:ml-auto sm:w-auto'>
                            <p className='flex items-center gap-x-1.5 sm:justify-end text-lg font-medium'><ArrowUp /><span className=" text-semantic-success-500"> 8.5%</span></p>
                            <p className='text-lg font-medium text-grey-500'>VS LAST MONTH</p>
                        </div>
                    </div>
                    <Separator />
                    <div className='overflow-x-auto'>
                        <div className='min-w-[580px] min-h-[290px]'>
                            <ClientOnly fallback={<Fallback />}>
                                {() => <Bar options={options} data={barChartData} />}
                            </ClientOnly>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                    <div className='flex flex-col items-start gap-3 sm:items-center sm:flex-row'>
                        <div className='w-full mxs:grow mxs:w-auto'>
                            <div className="flex items-center gap-x-2 gap-y-1">
                                <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                    <Dollar />
                                </span>
                                <h4>Total Spend</h4>
                            </div>
                        </div>
                        <div className='w-full sm:w-auto sm:min-w-[280px]'>
                            <div className='grid grid-cols-3 gap-1 p-[3px] border border-solid border-grey-50'>
                                <ExpenditureTab dynamicDates={dynamicDates} />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col items-center gap-x-3 gap-y-6 sm:flex-row'>
                        <div className='w-full sm:grow sm:w-auto'>
                            <Expenditure />
                        </div>
                        <div className='w-full sm:text-right sm:ml-auto sm:w-auto'>
                            <p className='flex items-center gap-x-1.5 sm:justify-end text-lg font-medium'><ArrowUp /><span className=" text-semantic-success-500"> 8.5%</span></p>
                            <p className='text-lg font-medium text-grey-500'>VS LAST MONTH</p>
                        </div>
                    </div>
                    <Separator />
                    <div className='overflow-x-auto'>
                        <div className='min-w-[580px] min-h-[290px]'>
                            <ClientOnly fallback={<Fallback />}>
                                {() => <Line options={options} data={lineChartData} />}
                            </ClientOnly>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="mt-6" />
        </section>
    );
}

export default DetailChart;

function Fallback() {
    return <div>Generating Chart</div>;
}