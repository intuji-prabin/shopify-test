import { ProductCard } from '~/components/ui/product-card';
import { SimilarProduct } from './route';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
export default function ProductsRelatedProduct({
  products,
}: {
  products?: SimilarProduct[];
}) {
  return (
    <section className="bg-white mt-0 border-[1px] border-grey-50 pt-[50px]">
      <div className="container">
        <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase">
          Similar Products
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-[18px]">
          {/* {products.map((product) => (
            <ProductCard
              key={product.sku + 'item'}
              featuredImageUrl={product.imageUrl ?? DEFAULT_IMAGE.IMAGE}
              isBuyQtyAvailable={product.isQtyBuyAvailable}
              isFavorited={product.isFavorited}
              sku={product.sku}
              productName={product.name}
              buyPrice={product.productBuyPrice}
              rppPrice={product.productRRP}
              imageBackgroundColor={'#0092CF'}
            />
          ))} */}
        </div>
      </div>
    </section>
  );
}
