import CompareProductSearch from './compare-product-search';
import CompareDefaultItem from './comparison-default-item';

export default function ComparisonItems() {
  return (
    <div className="flex flex-row gap-3 md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-[18px] p-6 card-wrapper md:overflow-x-hidden overflow-x-scroll">
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
