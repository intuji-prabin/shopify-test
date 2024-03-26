import ComparisonItems from './comparison-items';
import ComparisonProperties from './comparison-properties';

export default function ComparisonWrapper() {
  return (
    <div className="mt-6 bg-white">
      <ComparisonItems
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of'
        }
        buyPrice={649.22}
        rppPrice={649.22}
        imageUrl={'/product.png'}
      />
      <ComparisonProperties />
    </div>
  );
}
