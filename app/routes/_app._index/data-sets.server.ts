import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {AllowedHTTPMethods} from '~/lib/enums/api.enum';

type SubDataType = {
  labels: string[];
  currency: string;
  amount: number;
  percentage: number;
  increment: boolean;
  data: (number | null)[];
};
type AreaChartDataType = {
  monthly: SubDataType;
  ytd: SubDataType;
};

type ChartData = {
  labels: string[];
  datasets: {
    fill: boolean;
    label: string;
    data: (number | null)[];
    spanGaps: boolean;
    borderColor: string;
    backgroundColor: string;
  }[];
};
type Data = {
  areaChartData: ChartData;
  currency: string;
  amount: string | number;
  percentage: number;
  increment: boolean;
};
export type ResponseAreaDataType = {
  monthly: Data;
  ytd: Data;
};

type BarChartDataType = {
  totalSpend: {[key: string]: Total};
  totalInvoicing: {[key: string]: Total};
};
type Total = {
  labels: string[];
  currency: string;
  amount: number;
  lastAmount: number;
  fullSpendAmount: number;
  percentage: number;
  increment: boolean;
  datasets: Dataset[];
};
type Dataset = {
  label: string;
  data: (number | null)[];
};

type ChartReponseData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    cubicInterpolationMode?: string;
    borderWidth?: number;
    pointBorderWidth?: number;
    pointRadius?: number;
    pointBackgroundColor?: string;
  }[];
};

const formatAmount = (amount: number) => {
  return amount > 999 ? (amount / 1000).toFixed(2) + 'k' : amount;
};

export async function getChartData(customerID: string) {
  try {
    const response = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.REPORT.GET}/${customerID}`,
    });
    if (response?.errors) {
      return {
        finalAreaResponse: {},
        finalBarResponse: {},
      };
    }
    if (!response?.status) {
      return {
        finalAreaResponse: {},
        finalBarResponse: {},
      };
    }

    const finalAreaResponse = await formatAreaResponse(response?.payload);
    const finalBarResponse = await formatBarResponse(response?.payload);
    return {finalAreaResponse, finalBarResponse};
  } catch (error) {
    console.log('error', error);
    return {
      finalAreaResponse: {},
      finalBarResponse: {},
    };
  }
}

const formatAreaResponse = async (
  response: AreaChartDataType,
): Promise<any> => {
  const formatChartData = (data: SubDataType) => {
    return {
      labels: data?.labels,
      datasets: [
        {
          fill: true,
          label: '',
          data: data?.data,
          spanGaps: false,
          borderColor: data?.increment
            ? 'rgba(59, 186, 83, 1)'
            : 'rgba(217, 47, 40, 1)',
          backgroundColor: data?.increment
            ? 'rgba(58, 131, 72, 0.23)'
            : 'rgba(217, 47, 40, 0.23)',
        },
      ],
    };
  };

  const formatChartDataAndOtherFields = (data: SubDataType) => {
    return {
      areaChartData: formatChartData(data),
      currency: data?.currency,
      amount: formatAmount(data?.amount),
      percentage: data?.percentage,
      increment: data?.increment,
    };
  };

  return {
    monthly: formatChartDataAndOtherFields(response?.monthly),
    ytd: formatChartDataAndOtherFields(response?.ytd),
  };
};

const formatBarResponse = async (response: any): Promise<any> => {
  const FinalTotalSpend = response?.totalSpend;
  const FinalTotalInvoicing = response?.totalInvoice;

  const formatBarChartData = (data: ChartReponseData) => {
    return {
      labels: data?.labels,
      datasets: [
        {
          label: data?.datasets[0]?.label,
          data: data?.datasets[0]?.data.map((item) => item / 1000),
          borderColor: 'rgb(0, 146, 207)',
          backgroundColor: 'rgb(0, 146, 207)',
        },
        {
          label: data?.datasets[1]?.label,
          data: data?.datasets[1]?.data.map((item) => item / 1000),
          borderColor: 'rgb(200, 162, 0)',
          backgroundColor: 'rgb(200, 162, 0)',
        },
      ],
    };
  };

  const formatLineChartData = (data: ChartReponseData) => {
    return {
      labels: data?.labels,
      datasets: [
        {
          label: data?.datasets[0]?.label,
          data: data?.datasets[0]?.data.map((item) => item / 1000),
          cubicInterpolationMode: 'monotone',
          borderColor: 'rgb(0, 146, 207)',
          borderWidth: 2,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'white',
        },
        {
          label: data?.datasets[1]?.label,
          data: data?.datasets[1]?.data.map((item) => item / 1000),
          cubicInterpolationMode: 'monotone',
          borderColor: 'rgb(200, 162, 0)',
          borderWidth: 2,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'white',
        },
      ],
    };
  };

  const formatChartDataAndOtherFields = (data: Total, chartType: string) => {
    return {
      currency: data?.currency,
      amount: formatAmount(data?.amount),
      lastAmount: formatAmount(data?.lastAmount),
      fullSpendAmount: formatAmount(data?.fullSpendAmount),
      percentage: data?.percentage,
      increment: data?.increment,
      [`${chartType}ChartData`]:
        chartType === 'bar'
          ? formatBarChartData(data as any)
          : formatLineChartData(data as any),
    };
  };

  const formatBarChartDataAndOtherFields = (data: Total) => {
    return formatChartDataAndOtherFields(data, 'bar');
  };

  const formatLineChartDataAndOtherFields = (data: Total) => {
    return formatChartDataAndOtherFields(data, 'line');
  };

  return {
    totalSpend: {
      ytd: formatBarChartDataAndOtherFields(FinalTotalSpend?.ytd),
      qtd: formatBarChartDataAndOtherFields(FinalTotalSpend?.qtd),
      mtd: formatBarChartDataAndOtherFields(FinalTotalSpend?.mtd),
    },
    totalInvoicing: {
      ytd: formatLineChartDataAndOtherFields(FinalTotalInvoicing?.ytd),
      qtd: formatLineChartDataAndOtherFields(FinalTotalInvoicing?.qtd),
      mtd: formatLineChartDataAndOtherFields(FinalTotalInvoicing?.mtd),
    },
  };
};

export async function getExpenditureData(customerID: string) {
  try {
    const response = await useFetch<any>({
      method: AllowedHTTPMethods.GET,
      url: `${ENDPOINT.REPORT.PRODUCT_GET}/${customerID}`,
    });

    if (response?.errors) {
      return {
        expenditureData: {},
      };
    }
    if (!response?.status) {
      return {
        expenditureData: {},
      };
    }
    console.log('repsone', response?.payload);
    const finalResponse = await formatExpenditureResponse(response?.payload);
    return finalResponse;
  } catch (error) {
    console.log('error', error);
    return {
      expenditureData: {},
    };
  }
}

const formatExpenditureResponse = async (response: any): Promise<any> => {
  const formatChartData = (data: any) => {
    const finalPrice = data?.price.map((num: number) => Number(num.toFixed(2)));
    return {
      labels: data?.label,
      totalSpending: data?.total,
      datasets: [
        {
          label: 'Expenditure',
          backgroundColor: data?.backgroundColor,
          data: data?.data,
          cutout: '80%',
          price: finalPrice,
        },
      ],
    };
  };
  return {
    spending_by_product: response?.spending_by_product,
    expenditure_brands: formatChartData(response?.expenditure_brands),
    expenditure_category: formatChartData(response?.expenditure_category),
    currency: response?.currency_code || '$',
  };
};

// Actual values at first

// export const labels = ['Jan', 'Feb', 'Mar', 'Apr'];
// export const areaChartData = {
//   labels,
//   datasets: [
//     {
//       fill: true,
//       label: '',
//       data: [500, 300, null, null],
//       spanGaps: false,
//       borderColor: 'rgb(58, 131, 72)',
//       backgroundColor: 'rgba(58, 131, 72, 0.23)',
//     },
//   ],
// };

// export const barLabels = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
// ];
// export const barChartData = {
//   labels: barLabels,
//   datasets: [
//     {
//       label: '2023',
//       data: [100, 200, 400, 700, 900, 1000, 1200],
//       borderColor: 'rgb(0, 146, 207)',
//       backgroundColor: 'rgb(0, 146, 207)',
//     },
//     {
//       label: '2022',
//       data: [1000, 300, 100, 350, 100, 200, 300],
//       borderColor: 'rgb(200, 162, 0)',
//       backgroundColor: 'rgb(200, 162, 0)',
//     },
//   ],
// };
// export const lineChartData = {
//   labels: barLabels,
//   datasets: [
//     {
//       label: '2023',
//       data: [100, 200, 400, 700, 900, 1000, 1200],
//       cubicInterpolationMode: 'monotone',
//       borderColor: 'rgb(0, 146, 207)',
//       borderWidth: 2,
//       pointBorderWidth: 2,
//       pointRadius: 5,
//       pointBackgroundColor: 'white',
//     },
//     {
//       label: '2022',
//       data: [1000, 300, 100, 350, 100, 200, 300],
//       cubicInterpolationMode: 'monotone',
//       borderColor: 'rgb(200, 162, 0)',
//       borderWidth: 2,
//       pointBorderWidth: 2,
//       pointRadius: 5,
//       pointBackgroundColor: 'white',
//     },
//   ],
// };

// export const doughnutLabels = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
// ];
// export const doughnutChartData = {
//   labels: doughnutLabels,
//   datasets: [
//     {
//       label: 'Expenditure',
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         'rgba(255, 206, 86, 0.2)',
//         'rgba(75, 192, 192, 0.2)',
//         'rgba(153, 102, 255, 0.2)',
//         'rgba(255, 159, 64, 0.2)',
//         'rgba(222, 123, 4, 0.2)',
//       ],
//       data: [10, 10, 10, 10, 10, 10, 40],
//       cutout: '80%',
//       price: [120, 1330, 1550, 1120, 19980, 123230, 4440],
//     },
//   ],
// };
