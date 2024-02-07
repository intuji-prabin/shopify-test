import Control from './properties/control';
import Dimensions from './properties/dimensions';
import PowerSupply from './properties/powerSupply';
import Sensor from './properties/sensor';
import Temperature from './properties/temperature';
import Weight from './properties/weight';

export default function ComparisonProperties() {
  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        <Dimensions />
        <Control />
        <Temperature />
        <PowerSupply />
        <Sensor />
        <Weight />
      </div>
    </>
  );
}
