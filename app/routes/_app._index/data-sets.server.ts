import {useFetch} from '~/hooks/useFetch';
import {ENDPOINT} from '~/lib/constants/endpoint.constant';
import {PDF} from '~/lib/constants/pdf.constent';
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
    // const response = await useFetch<any>({
    //   method: AllowedHTTPMethods.GET,
    //   url: `${ENDPOINT.REPORT.GET}/${customerID}`,
    // });

    const response: any = await fetch(
      'http://172.17.30.6:8300/api/v1/sales_report/70868',
      {
        headers: {
          apiKey: PDF.SECRET_KEY,
        },
        method: 'GET',
      },
    );
    console.log('response', response);

    // if (response?.errors) {
    //   return {
    //     finalAreaResponse: {},
    //     finalBarResponse: {},
    //   };
    // }
    // if (!response?.status_code) {
    //   return {
    //     finalAreaResponse: {},
    //     finalBarResponse: {},
    //   };
    // }
    const data = await response.json();
    console.log('data', data);
    // const finalAreaResponse = await formatAreaResponse(response?.payload);
    // const finalBarResponse = await formatBarResponse(response?.payload);

    const finalAreaResponse = await formatAreaResponse(data?.payload);
    const finalBarResponse = await formatBarResponse(data?.payload);
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
    // const response = await useFetch<any>({
    //   method: AllowedHTTPMethods.GET,
    //   url: `${ENDPOINT.REPORT.PRODUCT_GET}/${customerID}`,
    // });

    // const response: any = {
    //   status_code: 200,
    //   success: true,
    //   message: 'Successfully generated graph.',
    //   payload: {
    //     expenditure_brands: {
    //       label: [
    //         'Brand 1',
    //         'Brand 10',
    //         'Brand 2',
    //         'Brand 3',
    //         'Brand 4',
    //         'Brand 5',
    //         'Brand 6',
    //         'Brand 7',
    //         'Brand 8',
    //         'Brand 9',
    //         'No Brand',
    //       ],
    //       data: [
    //         3.79, 3.83, 2.47, 5.66, 7.13, 3.88, 6.08, 4.47, 4.66, 4.14, 53.9,
    //       ],
    //       price: [
    //         5923.360000000001, 5988.290000000001, 3860.54, 8863.079999999998,
    //         11159.750000000002, 6066.819999999998, 9506.75, 6987.58,
    //         7298.369999999999, 6476.65, 84350.44000000005,
    //       ],
    //       backgroundColor: [
    //         'rgba(60, 232, 56, 0.2)',
    //         'rgba(220, 125, 173, 0.2)',
    //         'rgba(21, 36, 153, 0.2)',
    //         'rgba(237, 221, 138, 0.2)',
    //         'rgba(178, 242, 252, 0.2)',
    //         'rgba(201, 3, 247, 0.2)',
    //         'rgba(180, 239, 127, 0.2)',
    //         'rgba(103, 114, 66, 0.2)',
    //         'rgba(213, 189, 170, 0.2)',
    //         'rgba(5, 72, 177, 0.2)',
    //         'rgba(204, 27, 156, 0.2)',
    //       ],
    //     },
    //     expenditure_category: {
    //       label: [
    //         'Machines',
    //         'Safety',
    //         'Gas Equipment',
    //         'Filler Metals',
    //         'Accessories & Spares',
    //         'Automation',
    //         'Merchandise',
    //       ],
    //       data: [5.83, 10.79, 15.06, 44.47, 19.13, 4.31, 0.43],
    //       price: [
    //         42674.75999999998, 78979.8, 110245.92000000007, 325574.82,
    //         140024.99000000014, 31528.250000000015, 3119.4900000000002,
    //       ],
    //       backgroundColor: [
    //         'rgba(125, 59, 227, 0.2)',
    //         'rgba(112, 73, 101, 0.2)',
    //         'rgba(50, 100, 97, 0.2)',
    //         'rgba(235, 64, 127, 0.2)',
    //         'rgba(190, 147, 130, 0.2)',
    //         'rgba(61, 200, 112, 0.2)',
    //         'rgba(155, 84, 74, 0.2)',
    //       ],
    //     },
    //     spending_by_product: [
    //       {
    //         id: 'PRD209610',
    //         shopify_id: 'SHOP724400',
    //         product_name: 'Random Product 3153',
    //         quantity: 1,
    //         total_spending: 618.4499999999999,
    //         recent_purchase_date: '2024-05-20 08:49:34',
    //       },
    //       {
    //         id: 'PRD771258',
    //         shopify_id: 'SHOP570968',
    //         product_name: 'Random Product 8872',
    //         quantity: 1,
    //         total_spending: 99.57,
    //         recent_purchase_date: '2024-05-20 08:49:34',
    //       },
    //       {
    //         id: 'PRD829257',
    //         shopify_id: 'SHOP335118',
    //         product_name: 'Random Product 4240',
    //         quantity: 1,
    //         total_spending: 869.4,
    //         recent_purchase_date: '2024-05-20 08:49:34',
    //       },
    //       {
    //         id: 'PRD162812',
    //         shopify_id: 'SHOP219169',
    //         product_name: 'Random Product 5869',
    //         quantity: 1,
    //         total_spending: 800.8,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD185034',
    //         shopify_id: 'SHOP698611',
    //         product_name: 'Random Product 1776',
    //         quantity: 1,
    //         total_spending: 787.76,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD262269',
    //         shopify_id: 'SHOP101849',
    //         product_name: 'Random Product 6891',
    //         quantity: 1,
    //         total_spending: 88.74,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD262476',
    //         shopify_id: 'SHOP283624',
    //         product_name: 'Random Product 7775',
    //         quantity: 1,
    //         total_spending: 30.06,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD569684',
    //         shopify_id: 'SHOP450496',
    //         product_name: 'Random Product 3897',
    //         quantity: 1,
    //         total_spending: 45.12,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD603268',
    //         shopify_id: 'SHOP482633',
    //         product_name: 'Random Product 3144',
    //         quantity: 1,
    //         total_spending: 69.44,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //       {
    //         id: 'PRD717417',
    //         shopify_id: 'SHOP259326',
    //         product_name: 'Random Product 9895',
    //         quantity: 1,
    //         total_spending: 584.9399999999999,
    //         recent_purchase_date: '2024-05-20 08:49:33',
    //       },
    //     ],
    //   },
    // };

    const response: any = await fetch(
      'http://172.17.30.6:8300/api/v1/product_report/70868',
      {
        headers: {
          apiKey: PDF.SECRET_KEY,
        },
        method: 'GET',
      },
    );
    console.log('response', response);

    // if (response?.errors) {
    //   return {
    //     expenditureData: {},
    //   };
    // }
    // if (!response?.status_code) {
    //   return {
    //     expenditureData: {},
    //   };
    // }
    const data = await response.json();
    // const finalResponse = await formatExpenditureResponse(response?.payload);
    const finalResponse = await formatExpenditureResponse(data?.payload);
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
      totalSpending: formatAmount(
        finalPrice.reduce(
          (accumulator: number, currentValue: number) =>
            accumulator + currentValue,
          0,
        ),
      ),
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

export const doughnutLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];
export const doughnutChartData = {
  labels: doughnutLabels,
  datasets: [
    {
      label: 'Expenditure',
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(222, 123, 4, 0.2)',
      ],
      data: [10, 10, 10, 10, 10, 10, 40],
      cutout: '80%',
      price: [120, 1330, 1550, 1120, 19980, 123230, 4440],
    },
  ],
};
