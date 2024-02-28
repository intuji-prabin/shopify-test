import ProductTab from './productTabs';
import ProductsRelatedProduct from './productsRelatedProduct';
import { BackButton } from '~/components/ui/back-button';
import { Breadcrumb, BreadcrumbItem } from '~/components/ui/breadcrumb';
import { Routes } from '~/lib/constants/routes.constent';
import { FC, ReactNode } from 'react';
import { json, useLoaderData, useParams } from '@remix-run/react';
import WelderHelment from 'public/weld-helmet.png';
import ProductInformation from './productInformation';
import { getProductDetails } from './product.server';
import { LoaderFunctionArgs } from '@remix-run/server-runtime';
import { getUserDetails } from '~/lib/utils/user-session.server';

export type SimilarProduct = {
  name: string;
  imageUrl: string;
  isFavorited: boolean;
  isQtyBuyAvailable: boolean;
  productBuyPrice: number;
  productRRP: number;
  sku: string;
};

export type Product = {
  title: string;
  isFavorited: boolean;
  productBuyPrice: number;
  productRRP: number;
  supplierSku: string;
  unitOfMeasurement: string;
  uom: string;
  isInStock: boolean;
  unitOfMeasure: {
    unit: string;
    conversion_factor: number;
  }[];
  bulkPricings: {
    quantity: string;
    price: number;
  }[];
  pickUpLocation: string;
  pickUpReadyTime: string;
  similarProducts: SimilarProduct[];
};

// async function getAProduct() {
//   const productDetailsFromAPI = {
//     name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
//     imgUrl: '',
//     isFavorited: false,
//     productBuyPrice: 649.23423,
//     productRRP: 79.234234,
//     sku: '1-1601-EC',
//     unitOfMeasurement: '1 Box',
//     isInStock: true,
//     bulkPricings: [
//       {
//         id: 1,
//         quantity: '1-50',
//         price: 732,
//       },
//       {
//         id: 2,
//         quantity: '100+',
//         price: 500,
//       },
//       {
//         id: 3,
//         quantity: '1-50',
//         price: 732,
//       },
//       {
//         id: 4,
//         quantity: '100+',
//         price: 500,
//       },
//       {
//         id: 5,
//         quantity: '1-50',
//         price: 732,
//       },
//       {
//         id: 6,
//         quantity: '100+',
//         price: 500,
//       },
//       {
//         id: 7,
//         quantity: '1-50',
//         price: 732,
//       },
//       {
//         id: 8,
//         quantity: '100+',
//         price: 500,
//       },
//     ],
//     pickUpLocation: 'SUPERCHEAP AUTO NZ PTY LTD',
//     pickUpReadyTime: '4 hours',
//     similarProducts: [
//       {
//         name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
//         imageUrl: WelderHelment,
//         isFavorited: true,
//         isQtyBuyAvailable: true,
//         productBuyPrice: 649.23423,
//         productRRP: 79.234234,
//         sku: '1-1901-EC',
//       },
//       {
//         name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
//         imageUrl: WelderHelment,
//         isFavorited: true,
//         isQtyBuyAvailable: true,
//         productBuyPrice: 649.23423,
//         productRRP: 79.234234,
//         sku: '1-1201-EC',
//       },
//       {
//         name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
//         imageUrl: WelderHelment,
//         isFavorited: false,
//         isQtyBuyAvailable: true,
//         productBuyPrice: 649.23423,
//         productRRP: 79.234234,
//         sku: '1-1801-EC',
//       },
//       {
//         name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
//         imageUrl: WelderHelment,
//         isFavorited: false,
//         isQtyBuyAvailable: true,
//         productBuyPrice: 649.23423,
//         productRRP: 79.234234,
//         sku: '1-1701-EC',
//       },
//     ],
//   };
//   return productDetailsFromAPI;
// }

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  try {
    const { productSlug } = params;
    const { userDetails } = await getUserDetails(request);
    const product = await getProductDetails(userDetails?.id, productSlug as string);

    const mainCategory = params.mainCategory;
    const categoryId = params.categoryId;
    const subCategoryId = params.subCategoryId;
    const productPage = params.productSlug;

    return json({
      product,
      mainCategory,
      categoryId,
      subCategoryId,
      productPage
    });
  } catch (error) {
    return json({});
  }
};

export default function route() {
  const { product, mainCategory, categoryId, subCategoryId, productPage } = useLoaderData<typeof loader>();
  return (
    <ProductDetailPageWrapper>
      <div className="flex items-center pt-6 pb-4 ">
        <BackButton title="" />
        <Breadcrumb>
          <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
            {mainCategory?.split('-').join(' ')}
          </BreadcrumbItem>
          <BreadcrumbItem href={Routes.CATEGORIES} className="capitalize">
            {categoryId?.split('-').join(' ')}
          </BreadcrumbItem>
          <BreadcrumbItem href={`/${mainCategory}/${categoryId}/${subCategoryId}`} className="capitalize">
            {subCategoryId?.split('-').join(' ')}
          </BreadcrumbItem>
          <BreadcrumbItem className="capitalize text-grey-800">
            {productPage?.split('-').join(' ')}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      <ProductInformation product={product} />
      <ProductTab />
      {/* <ProductsRelatedProduct products={product.similarProducts} /> */}
    </ProductDetailPageWrapper>
  );
}

const ProductDetailPageWrapper = ({ children }: { children: ReactNode }) => {
  return <div className="container">{children}</div>;
};
