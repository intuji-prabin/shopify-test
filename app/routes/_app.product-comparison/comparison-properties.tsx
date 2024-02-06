import {onOffControl} from './properties/control';
import {dimensions} from './properties/dimensions';
import {powerSupply} from './properties/powerSupply';
import {sensor} from './properties/sensor';
import {operatingTemp} from './properties/temperature';
import {weight} from './properties/weight';

export default function ComparisonProperties() {
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
