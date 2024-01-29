import { Doughnut } from "react-chartjs-2";
import { ClientOnly } from "remix-utils/client-only";
import ChartFallback from "./chartFallback";

const options = {
    responsive: true,
    borderWidth: 0,
    plugins: {
        legend: {
            display: false
        }
    },
}

const ExpenditureChart = ({ doughnutChartData }: { doughnutChartData: any }) => {
    return (
        <ClientOnly fallback={<ChartFallback />}>
            {() => <Doughnut options={options} data={doughnutChartData} />}
        </ClientOnly>
    );
}

export default ExpenditureChart;