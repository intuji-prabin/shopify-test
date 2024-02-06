import CompareProductSearch from './compare-product-search';
import CompareDefaultItem from './comparison-default-item';

export default function ComparisonItems() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[18px] p-6 card-wrapper ">
      <CompareDefaultItem
        imageUrl={'product.png'}
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of'
        }
        buyPrice={0}
        rppPrice={0}
        isFavourited={true}
      />
      <CompareProductSearch
        imageUrl={'product.png'}
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of'
        }
        buyPrice={0}
        rppPrice={0}
        isFavourited={true}
      />
      <CompareProductSearch
        imageUrl={'product.png'}
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of'
        }
        buyPrice={0}
        rppPrice={0}
        isFavourited={true}
      />
      <CompareProductSearch
        imageUrl={'product.png'}
        productName={
          'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of'
        }
        buyPrice={0}
        rppPrice={0}
        isFavourited={true}
      />
    </div>
  );
}
