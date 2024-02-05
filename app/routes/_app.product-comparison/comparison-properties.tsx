export default function ComparisonProperties() {
  const dimensions = [
    {
      id: 0,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 1,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 2,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 3,
      dimensionOne: '120 x 100 x 18 mm',
    },
  ];
  const onOffControl = [
    {
      id: 0,
      control: 'Automatic',
    },
    {
      id: 1,
      control: 'Automatic',
    },
    {
      id: 2,
      control: 'Automatic',
    },
    {
      id: 3,
      control: 'Automatic',
    },
  ];
  const operatingTemp = [
    {
      id: 0,
      temperature: '-5C to 55C',
    },
    {
      id: 1,
      temperature: '-5C to 55C',
    },
    {
      id: 2,
      temperature: '-5C to 55C',
    },
    {
      id: 3,
      temperature: '-5C to 55C',
    },
  ];
  const powerSupply = [
    {
      id: 0,
      Power: 'Solar Cells/Battery Back Up',
    },
    {
      id: 1,
      Power: 'Solar Cells/Battery Back Up',
    },
    {
      id: 2,
      Power: 'Solar Cells/Battery Back Up',
    },
    {
      id: 3,
      Power: 'Solar Cells/Battery Back Up',
    },
  ];
  const sensor = [
    {
      id: 0,
      sensors: '4 Optical Sensors',
    },
    {
      id: 1,
      sensors: '3 Optical Sensors',
    },
    {
      id: 2,
      sensors: '2  Optical Sensors',
    },
    {
      id: 3,
      sensors: '4 Optical Sensors',
    },
  ];
  const weight = [
    {
      id: 0,
      weightGram: '45g',
    },
    {
      id: 1,
      weightGram: '47g',
    },
    {
      id: 2,
      weightGram: '47g',
    },
    {
      id: 3,
      weightGram: '47g',
    },
  ];
  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            Filter Lens Dimensions
          </p>
          <div className="flex gap-6 px-6 py-3 justify-between">
            {dimensions.map((dimens) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={dimens.id}
                >
                  {dimens.dimensionOne}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            On/Off Control
          </p>
          <div className="flex gap-6 px-6 py-3  justify-between">
            {onOffControl.map((onOff) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={onOff.id}
                >
                  {onOff.control}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            Operating Temperature
          </p>
          <div className="flex gap-6 px-6 py-3 justify-between">
            {operatingTemp.map((temp) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={temp.id}
                >
                  {temp.temperature}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            Power Supply
          </p>
          <div className="flex gap-6 px-6 py-3 justify-between">
            {powerSupply.map((supply) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={supply.id}
                >
                  {supply.Power}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            Sensors
          </p>
          <div className="flex gap-6 px-6 py-3 justify-between">
            {sensor.map((sen) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={sen.id}
                >
                  {sen.sensors}
                </p>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
            Weight
          </p>
          <div className="flex gap-6 px-6 py-3 justify-between">
            {weight.map((gram) => {
              return (
                <p
                  className="font-bold text-lg text-grey-400 leading-[26px]"
                  key={gram.id}
                >
                  {gram.weightGram}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
