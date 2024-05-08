import { Expenditure } from "../icons/expenditure";
import ExpenditureChart from "./expenditureChart";
import { SearchInput } from "./search-input";

type SelectInputType = { value: string; label: string };

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
                            className="w-full !border-grey-100 filter-select"
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
                        <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                            <div className="relative">
                                <ExpenditureChart doughnutChartData={doughnutChartData} />
                                <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                    <p className="text-center">Total Spending</p>
                                    <p className="text-2xl italic font-bold text-center">$ <span className="text-[40px]">780.4</span> K</p>
                                </div>
                            </div>
                            <div>
                                <ul>
                                    {doughnutChartData.labels.map((label: string, index: number) => (
                                        <li className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50" key={'label' + index}>
                                            <p><span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: doughnutChartData.datasets[0].backgroundColor[index] }}></span>{label}</p>
                                            <h5>${doughnutChartData.datasets[0].price[index]}</h5>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                        <div className="flex items-center gap-x-2 gap-y-1">
                            <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                <Expenditure />
                            </span>
                            <h4>Expenditure by Brands</h4>
                        </div>
                        <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                            <div className="relative">
                                <ExpenditureChart doughnutChartData={doughnutChartData} />
                                <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                    <p className="text-center">Total Spending</p>
                                    <p className="text-2xl italic font-bold text-center">$ <span className="text-[40px]">780.4</span> K</p>
                                </div>
                            </div>
                            <div>
                                <ul>
                                    {doughnutChartData.labels.map((label: string, index: number) => (
                                        <li className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50" key={'label' + index}>
                                            <p><span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: doughnutChartData.datasets[0].backgroundColor[index] }}></span>{label}</p>
                                            <h5>${doughnutChartData.datasets[0].price[index]}</h5>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-x-2 gap-y-1">
                            <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                                <Expenditure />
                            </span>
                            <h4>Spending by products</h4>
                        </div>
                        <SearchInput />
                    </div>
                </div>
            </section>
            <section className="container">
                <div className="p-6 space-y-3 bg-white mxs:space-y-6">
                    <div className="flex items-center gap-x-2 gap-y-1">
                        <span className='flex items-center justify-center w-12 h-12 bg-primary-200'>
                            <Expenditure />
                        </span>
                        <h4>Transaction History</h4>
                    </div>
                </div>
            </section>
        </>
    );
}

export default ExpenditureCard;