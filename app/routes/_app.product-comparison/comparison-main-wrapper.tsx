import ComparisonItems from './comparison-items';
import ComparisonProperties from './comparison-properties';

export default function ComparisonWrapper() {
  return (
    <div className="bg-white mt-6">
      <ComparisonItems
        productName={''}
        buyPrice={0}
        rppPrice={0}
        imageUrl={''}
      />
      <ComparisonProperties />
    </div>
  );
}
