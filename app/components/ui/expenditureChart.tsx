import { Doughnut } from "react-chartjs-2";
import { ClientOnly } from "remix-utils/client-only";
import ChartFallback from "./chartFallback";

const options = {
    responsive: true,
    borderWidth: 0,
    plugins: {
        legend: {
            display: false
        },
        afterDatasetsDraw: ({ chart }: { chart: any }) => {
            // Your custom logic after datasets are drawn
            console.log("Datasets are drawn!");
            const { ctx, doughnutChartData } = chart;
            const centerX = chart.getDatasetMeta(0).data[0].x;
            const centerY = chart.getDatasetMeta(0).data[0].y;
            console.log(centerX)
            ctx.save();
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Text', centerX, centerY);
        },
    },
}

// const doughnutLabel = {
//     id: "doughnutLabel",
//     afterDatasetsDraw({ chart }: { chart: any }) {
//         const { ctx, doughnutChartData } = chart;
//         const centerX = chart.getDatasetMeta(0).data[0].x;
//         const centerY = chart.getDatasetMeta(0).data[0].y;
//         console.log(centerX)
//         ctx.save();
//         ctx.font = 'bold 10px sans-serif';
//         ctx.fillStyle = 'black';
//         ctx.textAlign = 'center';
//         ctx.textBaseline = 'middle';
//         ctx.fillText('Text', centerX, centerY);
//     }
// }

const ExpenditureChart = ({ doughnutChartData }: { doughnutChartData: any }) => {
    return (
        <ClientOnly fallback={<ChartFallback />}>
            {() => <Doughnut options={options} data={doughnutChartData} />}
        </ClientOnly>
    );
}

export default ExpenditureChart;