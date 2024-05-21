import { Can } from '~/lib/helpers/Can';
import { Expenditure } from "../icons/expenditure";
import ExpenditureChart from './expenditureChart';

const ExpenditureCard = ({ doughnutChartData, currency }: { doughnutChartData: any, currency: string }) => {

  return (
    <Can I="view" a="view_expenditure">
      <section className="container">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="space-y-2">
            <h2>Expenditures</h2>
            <p>
              A comprehensive overview of spending, detailing categories,
              brands, products, and transaction history for informed financial
              insights.
            </p>
          </div>
        </div>
      </section>
      <section className="container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {doughnutChartData?.expenditure_category?.labels || !doughnutChartData?.expenditure_category?.labels.some((element: any) => element === null) || doughnutChartData?.expenditure_category?.data &&
            <div className="p-6 space-y-3 bg-white mxs:space-y-6">
              <div className="flex items-center gap-x-2 gap-y-1">
                <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                  <Expenditure />
                </span>
                <h4>Expenditure by Categories</h4>
              </div>
              <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                <div className="relative">
                  <ExpenditureChart doughnutChartData={doughnutChartData?.expenditure_category} />
                  <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <p className="text-center">Total Spending</p>
                    <p className="text-2xl italic font-bold text-center">
                      {currency} <span className="text-[40px]">{doughnutChartData?.expenditure_category?.totalSpending}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <ul>
                    {doughnutChartData?.expenditure_category.labels.map(
                      (label: string, index: number) => (
                        <li
                          className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50"
                          key={'label' + index}
                        >
                          <p>
                            <span
                              className="inline-block w-3 h-3 mr-2 rounded-full"
                              style={{
                                backgroundColor:
                                  doughnutChartData?.expenditure_category?.datasets[0]?.backgroundColor[
                                  index
                                  ],
                              }}
                            ></span>
                            {label}
                          </p>
                          <h5>{currency}{doughnutChartData?.expenditure_category?.datasets[0]?.price[index]}</h5>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          }
          {doughnutChartData?.expenditure_brands?.labels || !doughnutChartData?.expenditure_brands?.labels.some((element: any) => element === null) || doughnutChartData?.expenditure_brands?.data &&
            <div className="p-6 space-y-3 bg-white mxs:space-y-6">
              <div className="flex items-center gap-x-2 gap-y-1">
                <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                  <Expenditure />
                </span>
                <h4>Expenditure by Brands</h4>
              </div>
              <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                <div className="relative">
                  <ExpenditureChart doughnutChartData={doughnutChartData?.expenditure_brands} />
                  <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    <p className="text-center">Total Spending</p>
                    <p className="text-2xl italic font-bold text-center">
                      {currency} <span className="text-[40px]">{doughnutChartData?.expenditure_brands?.totalSpending}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <ul>
                    {doughnutChartData?.expenditure_brands.labels.map(
                      (label: string, index: number) => (
                        <li
                          className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50"
                          key={'label' + index}
                        >
                          <p>
                            <span
                              className="inline-block w-3 h-3 mr-2 rounded-full"
                              style={{
                                backgroundColor:
                                  doughnutChartData?.expenditure_brands?.datasets[0]?.backgroundColor[
                                  index
                                  ],
                              }}
                            ></span>
                            {label}
                          </p>
                          <h5>{currency}{doughnutChartData?.expenditure_brands?.datasets[0]?.price[index]}</h5>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    </Can>
  );
};

export default ExpenditureCard;
