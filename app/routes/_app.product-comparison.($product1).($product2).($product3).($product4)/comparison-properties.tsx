import ComparisionTableRow from './comparison-Table-Row';

export default function ComparisonProperties() {
  const dimensions = [
    {
      id: 0,
      value: '120 x 100 x 18 mm',
    },
    {
      id: 1,
      value: '120 x 100 x 18 mm',
    },
    {
      id: 2,
      value: '120 x 100 x 18 mm',
    },
    {
      id: 3,
      value: '120 x 100 x 18 mm',
    },
  ];
  const onOffControl = [
    {
      id: 0,
      value: 'Automatic',
    },
    {
      id: 1,
      value: 'Automatic',
    },
    {
      id: 2,
      value: 'Automatic',
    },
    {
      id: 3,
      value: 'Automatic',
    },
  ];
  const operatingTemp = [
    {
      id: 0,
      value: '-5C to 55C',
    },
    {
      id: 1,
      value: '-5C to 55C',
    },
    {
      id: 2,
      value: '-5C to 55C',
    },
    {
      id: 3,
      value: '-5C to 55C',
    },
  ];
  const powerSupply = [
    {
      id: 0,
      value: 'Solar Cells/Battery Back Up',
    },
    {
      id: 1,
      value: 'Solar Cells/Battery Back Up',
    },
    {
      id: 2,
      value: 'Solar Cells/Battery Back Up',
    },
    {
      id: 3,
      value: 'Solar Cells/Battery Back Up',
    },
  ];
  const sensor = [
    {
      id: 0,
      value: '4 Optical Sensors',
    },
    {
      id: 1,
      value: '3 Optical value',
    },
    {
      id: 2,
      value: '2  Optical value',
    },
    {
      id: 3,
      value: '4 Optical value',
    },
  ];
  const weight = [
    {
      id: 0,
      value: '45g',
    },
    {
      id: 1,
      value: '47g',
    },
    {
      id: 2,
      value: '47g',
    },
    {
      id: 3,
      value: '47g',
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <ComparisionTableRow
        title="Filter Lens Dimensions"
        items={dimensions}
      />
      <ComparisionTableRow title="On/Off Control" items={onOffControl} />

      <ComparisionTableRow
        title="operating temperature"
        items={operatingTemp}
      />

      <ComparisionTableRow title="sensor" items={sensor} />

      <ComparisionTableRow title="Power Supply" items={powerSupply} />

      <ComparisionTableRow title="Weight" items={weight} />
    </div>
  );
}
