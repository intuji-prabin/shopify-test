import {Can} from '~/lib/helpers/Can';
import {Expenditure} from '../icons/expenditure';
import ExpenditureChart from './expenditureChart';
import {Separator} from './separator';

const ExpenditureCard = ({
  brand,
  category,
  currency,
  currencySymbol,
}: {
  brand: any;
  category: any;
  currency: string;
  currencySymbol: string;
}) => {
  return (
    <Can I="view" a="view_expenditure">
      <section className="container">
        <Separator className="mb-6" />
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
          <div className="p-6 space-y-3 bg-white mxs:space-y-6">
            <div className="flex items-center gap-x-2 gap-y-1">
              <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                <Expenditure />
              </span>
              <h4>Expenditure by Categories</h4>
            </div>
            <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <div className="relative expenditure__detail">
                <ExpenditureChart doughnutChartData={category} />
                <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <p className="text-center">Total Spending</p>
                  <p className="text-2xl italic font-bold text-center">
                    {currency}{' '}
                    <span className="text-3xl">
                      {currencySymbol && currencySymbol}
                      {category?.totalSpending && category?.totalSpending > 999
                        ? (category?.totalSpending / 1000).toFixed(2) + 'k'
                        : category?.totalSpending}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <ul>
                  {category.labels.map((label: string, index: number) => (
                    <li
                      className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50"
                      key={'label' + index}
                    >
                      <p>
                        <span
                          className="inline-block w-3 h-3 mr-2 rounded-full"
                          style={{
                            backgroundColor:
                              category?.datasets[0]?.backgroundColor[index],
                          }}
                        ></span>
                        {label}
                      </p>
                      <h5>
                        {currency} {currencySymbol && currencySymbol}
                        {category?.datasets[0]?.price[index]}
                      </h5>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-3 bg-white mxs:space-y-6">
            <div className="flex items-center gap-x-2 gap-y-1">
              <span className="flex items-center justify-center w-12 h-12 bg-primary-200">
                <Expenditure />
              </span>
              <h4>Expenditure by Brands</h4>
            </div>
            <div className="grid items-start grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              <div className="relative expenditure__detail">
                <ExpenditureChart doughnutChartData={brand} />
                <div className="absolute space-y-2 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                  <p className="text-center">Total Spending</p>
                  <p className="text-2xl italic font-bold text-center">
                    {currency}{' '}
                    <span className="text-3xl">
                      {currencySymbol && currencySymbol}
                      {brand?.totalSpending && brand?.totalSpending > 999
                        ? (brand?.totalSpending / 1000).toFixed(2) + 'k'
                        : brand?.totalSpending}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <ul>
                  {brand.labels.map((label: string, index: number) => (
                    <li
                      className="flex items-center justify-between pb-2 mb-2 border-b border-solid border-gray-50"
                      key={'label' + index}
                    >
                      <p>
                        <span
                          className="inline-block w-3 h-3 mr-2 rounded-full"
                          style={{
                            backgroundColor:
                              brand?.datasets[0]?.backgroundColor[index],
                          }}
                        ></span>
                        {label}
                      </p>
                      <h5>
                        {currency} {currencySymbol && currencySymbol}
                        {brand?.datasets[0]?.price[index]}
                      </h5>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Can>
  );
};

export default ExpenditureCard;
