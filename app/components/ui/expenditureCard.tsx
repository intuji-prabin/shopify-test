import { Expenditure } from "../icons/expenditure";
import ExpenditureChart from "./expenditureChart";
import { SelectInputType } from "./select-input";

const dateOptions: SelectInputType[] = [
    { label: '2021/04/08 - 2021/04/10', value: '2021/04/08 - 2021/04/10' },
    { label: '2021/05/08 - 2021/05/10', value: '2021/05/08 - 2021/05/10' },
];

const handleOnchange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    console.log("Selected Date:", selectedValue);
};

const ExpenditureCard = ({ doughnutChartData }: { doughnutChartData: any }) => {
    return (
        <>
            <section className="container">
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
                    <div className="space-y-2">
                        <h2>Expenditures</h2>
                        <p>A comprehensive overview of spending, detailing categories, brands, products, and transaction history for informed financial insights.</p>
                    </div>
                    <div className="sm:min-w-[300px] w-full mxs:w-auto">
                        <p>Select Date Range to Filter Data</p>
                        <select
                            name="dateRange"
                            onChange={handleOnchange}
                            className="w-full !border-grey-100"
                        >
                            {dateOptions.map((date, index) => (
                                <option value={date.value} key={index + 'date'}>{date.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                        <div className="flex items-center gap-x-2 gap-y-1">
                            <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                <Expenditure />
                            </span>
                            <h4>Expenditure by Categories</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                            <div className="relative">
                                <ExpenditureChart doughnutChartData={doughnutChartData} />
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <p>Total Spending</p>
                                </div>
                            </div>
                            <div>test</div>
                        </div>
                    </div>
                    <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                        <div className="flex items-center gap-x-2 gap-y-1">
                            <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                <Expenditure />
                            </span>
                            <h4>Expenditure by Brands</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                            <div>
                                <ExpenditureChart doughnutChartData={doughnutChartData} />
                            </div>
                            <div>test</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ExpenditureCard;