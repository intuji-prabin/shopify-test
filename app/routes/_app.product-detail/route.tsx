import ProductTab from './productTabs';
import ProductInformation from './productInformation';
import ProductsRelatedProduct from './productsRelatedProduct';
import {ProductCard} from '~/components/ui/product-card';

export default function route() {
  return (
    <>
      <div className="container">
        <ProductInformation />
        <ProductTab />
        <ProductsRelatedProduct />
      </div>
    </>
  );
}
