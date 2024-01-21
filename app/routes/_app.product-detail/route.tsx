import ProductTab from './productTabs';
import ProductInformation from './productInformation';
import ProductsRelatedProduct from './productsRelatedProduct';
import {ProductCard} from '~/components/ui/product-card';
import {Separator} from '@radix-ui/react-separator';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';

export default function route() {
  return (
    <>
      <div className="container">
        <div className=" pt-6 pb-4 flex items-center">
          <BackButton title="" />
          <Breadcrumb>
            <BreadcrumbItem href={Routes.SUPPORT}>
              Products/MIG Welders
            </BreadcrumbItem>
            <BreadcrumbItem
              href={Routes.SUPPORT_CONTACT_US}
              className="text-grey-900"
            >
              ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
              CIGWELD Edition
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <ProductInformation />
        <ProductTab />
        <ProductsRelatedProduct />
      </div>
    </>
  );
}
