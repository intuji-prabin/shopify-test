import ComparisonItems from './comparison-items';
import ComparisonProperties from './comparison-properties';

export default function ComparisonWrapper() {
  return (
    <div className="bg-white mt-6">
      <ComparisonItems />
      <ComparisonProperties />
    </div>
  );
}
