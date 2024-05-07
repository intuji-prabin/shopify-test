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
              data: [10000, 200121, 400444, 700233, 90000, 1000111, 120032],
            },
            {
              label: '2022',
              data: [100022, 30077, 100134, 35067, 100908, 200112, 3002323],
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
              data: [5002323, 80066, 100899, 1000456, 100123, 202340, 123550],
            },
            {
              label: '2022',
              data: [10056, 90666, 1000990, 3008878, 10001212, 900444, 600111],
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
              data: [600121, 40012, 80012, 1002, 180021, 100012, 200122],
            },
            {
              label: '2022',
              data: [100122, 200122, 501245, 500123, 1000123, 10011, 60023],
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
              data: [600343, 400112, 8005656, 100232, 1800112, 1000123, 20011],
            },
            {
              label: '2022',
              data: [10033, 200112, 50000, 500212, 100044, 100666, 600000],
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
              data: [
                5001212, 8003434, 1006656, 10001212, 1001212, 200122, 501222,
              ],
            },
            {
              label: '2022',
              data: [
                1001221, 90122, 1000333, 3001222, 10001212, 9001223, 6001212,
              ],
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
              data: [100121, 20012, 40011, 700333, 900667, 100034, 1200463],
            },
            {
              label: '2022',
              data: [1000, 300232, 10220, 350443, 100343, 2002233, 300233],
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
      ytdAmount: formatAmount(data?.ytdAmount),
      ytdLastYrAmount: formatAmount(data?.ytdLastYrAmount),
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
