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
  ytdAmount: number;
  ytdLastYrAmount: number;
  fullSpendAmount: number;
  percentage: number;
  increment: boolean;
  datasets: Dataset[];
};
type Dataset = {
  label: string;
  data: number[];
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
type CommonData = {
  currency: string;
  ytdAmount: string;
  ytdLastYrAmount: string;
  fullSpendAmount: string;
  percentage: number;
  increment: boolean;
};
type SpendData = CommonData & {
  barChartData: ChartReponseData;
};
type InvoicingData = CommonData & {
  lineChartData: ChartReponseData;
};
type TotalData = {
  ytd: SpendData | InvoicingData;
  qtd: SpendData | InvoicingData;
  mtd: SpendData | InvoicingData;
};
type ResponseBarChartDataType = {
  totalSpend: TotalData;
  totalInvoicing: TotalData;
};

const formatAmount = (amount: number) => {
  return amount > 999 ? amount / 1000 + 'k' : amount;
};

export async function getAreaChartData() {
  try {
    // const response = await useFetch<AreaChartDataType>({
    //   method: AllowedHTTPMethods.GET,
    //   url: ENDPOINT,
    // });

    const response: AreaChartDataType = {
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        currency: '$',
        amount: 7878755,
        percentage: 0.5,
        increment: false,
        data: [100, 200, 20, null],
      },
      ytd: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        currency: '$',
        amount: 56000,
        percentage: 8.5,
        increment: true,
        data: [
          100,
          200,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
        ],
      },
    };

    // if (response?.errors) {
    //   throw new Error('Something went wrong');
    // }
    // if (!response?.status) {
    //   console.log('firststatus');
    //   throw new Error(response?.message);
    // }
    const finalResponse = await formatAreaResponse(response);
    return finalResponse;
  } catch (error) {
    console.log('error', error);
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}

const formatAreaResponse = async (
  response: AreaChartDataType,
): Promise<ResponseAreaDataType> => {
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

export async function getBarChartData() {
  try {
    // const response = await useFetch<any>({
    //   method: AllowedHTTPMethods.GET,
    //   url: ENDPOINT,
    // });

    const response: BarChartDataType = {
      totalSpend: {
        ytd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 2000,
          ytdLastYrAmount: 1257,
          fullSpendAmount: 5000,
          percentage: 0.5,
          increment: true,
          datasets: [
            {
              label: '2023',
              data: [100, 200, 400, 700, 900, 1000, 1200],
            },
            {
              label: '2022',
              data: [1000, 300, 100, 350, 100, 200, 300],
            },
          ],
        },
        qtd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 12123,
          ytdLastYrAmount: 67676,
          fullSpendAmount: 99999,
          percentage: 3.9,
          increment: false,
          datasets: [
            {
              label: '2023',
              data: [500, 800, 100, 1000, 100, 200, 50],
            },
            {
              label: '2022',
              data: [100, 90, 1000, 300, 1000, 900, 600],
            },
          ],
        },
        mtd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 905612,
          ytdLastYrAmount: 432567,
          fullSpendAmount: 74231234,
          percentage: 1.04,
          increment: true,
          datasets: [
            {
              label: '2023',
              data: [600, 400, 800, 100, 1800, 1000, 200],
            },
            {
              label: '2022',
              data: [100, 200, 50, 500, 1000, 100, 600],
            },
          ],
        },
      },
      totalInvoicing: {
        ytd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 2000,
          ytdLastYrAmount: 1257,
          fullSpendAmount: 5000,
          percentage: 0.5,
          increment: false,
          datasets: [
            {
              label: '2023',
              data: [600, 400, 800, 100, 1800, 1000, 200],
            },
            {
              label: '2022',
              data: [100, 200, 50, 500, 1000, 100, 600],
            },
          ],
        },
        qtd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 98986,
          ytdLastYrAmount: 32456,
          fullSpendAmount: 12345,
          percentage: 3.5,
          increment: true,
          datasets: [
            {
              label: '2023',
              data: [500, 800, 100, 1000, 100, 200, 50],
            },
            {
              label: '2022',
              data: [100, 90, 1000, 300, 1000, 900, 600],
            },
          ],
        },
        mtd: {
          labels: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
          ],
          currency: '$',
          ytdAmount: 1223454,
          ytdLastYrAmount: 12311,
          fullSpendAmount: 45000,
          percentage: 7.7,
          increment: false,
          datasets: [
            {
              label: '2023',
              data: [100, 200, 400, 700, 900, 1000, 1200],
            },
            {
              label: '2022',
              data: [1000, 300, 100, 350, 100, 200, 300],
            },
          ],
        },
      },
    };
    // if (response?.errors) {
    //   throw new Error('Something went wrong');
    // }
    // if (!response?.status) {
    //   console.log('firststatus');
    //   throw new Error(response?.message);
    // }
    const finalResponse = await formatBarResponse(response);
    return finalResponse;
  } catch (error) {
    console.log('error', error);
    throw new Error(
      'Oops! Something went wrong. Please hold tight and try again in a little while. Thank you for your understanding.',
    );
  }
}

const formatBarResponse = async (response: BarChartDataType): Promise<any> => {
  const FinalTotalSpend = response?.totalSpend;
  const FinalTotalInvoicing = response?.totalInvoicing;

  const formatBarChartData = (data: ChartReponseData) => {
    return {
      labels: data?.labels,
      datasets: [
        {
          label: data?.datasets[0]?.label,
          data: data?.datasets[0]?.data,
          borderColor: 'rgb(0, 146, 207)',
          backgroundColor: 'rgb(0, 146, 207)',
        },
        {
          label: data?.datasets[1]?.label,
          data: data?.datasets[1]?.data,
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
          data: data?.datasets[0]?.data,
          cubicInterpolationMode: 'monotone',
          borderColor: 'rgb(0, 146, 207)',
          borderWidth: 2,
          pointBorderWidth: 2,
          pointRadius: 5,
          pointBackgroundColor: 'white',
        },
        {
          label: data?.datasets[1]?.label,
          data: data?.datasets[1]?.data,
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

  const formatChartDataAndOtherFields = (data: any, chartType: string) => {
    return {
      currency: data?.currency,
      ytdAmount: formatAmount(data?.ytdAmount),
      ytdLastYrAmount: formatAmount(data?.ytdLastYrAmount),
      fullSpendAmount: formatAmount(data?.fullSpendAmount),
      percentage: data?.percentage,
      increment: data?.increment,
      [`${chartType}ChartData`]:
        chartType === 'bar'
          ? formatBarChartData(data)
          : formatLineChartData(data),
    };
  };

  const formatBarChartDataAndOtherFields = (data: any) => {
    return formatChartDataAndOtherFields(data, 'bar');
  };

  const formatLineChartDataAndOtherFields = (data: any) => {
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

export const barLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];
export const barChartData = {
  labels: barLabels,
  datasets: [
    {
      label: '2023',
      data: [100, 200, 400, 700, 900, 1000, 1200],
      borderColor: 'rgb(0, 146, 207)',
      backgroundColor: 'rgb(0, 146, 207)',
    },
    {
      label: '2022',
      data: [1000, 300, 100, 350, 100, 200, 300],
      borderColor: 'rgb(200, 162, 0)',
      backgroundColor: 'rgb(200, 162, 0)',
    },
  ],
};
export const lineChartData = {
  labels: barLabels,
  datasets: [
    {
      label: '2023',
      data: [100, 200, 400, 700, 900, 1000, 1200],
      cubicInterpolationMode: 'monotone',
      borderColor: 'rgb(0, 146, 207)',
      borderWidth: 2,
      pointBorderWidth: 2,
      pointRadius: 5,
      pointBackgroundColor: 'white',
    },
    {
      label: '2022',
      data: [1000, 300, 100, 350, 100, 200, 300],
      cubicInterpolationMode: 'monotone',
      borderColor: 'rgb(200, 162, 0)',
      borderWidth: 2,
      pointBorderWidth: 2,
      pointRadius: 5,
      pointBackgroundColor: 'white',
    },
  ],
};

export const doughnutLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'Julydd',
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
