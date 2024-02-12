export const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
];

export const areaChartData = {
  labels,
  datasets: [
    {
      fill: true,
      label: '',
      data: [100, 200, 400, 700, 900, 1000, 1200],
      borderColor: 'rgb(58, 131, 72)',
      backgroundColor: 'rgba(58, 131, 72, 0.5)',
    },
  ],
};

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

export const doughnutChartData = {
  labels: labels,
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
