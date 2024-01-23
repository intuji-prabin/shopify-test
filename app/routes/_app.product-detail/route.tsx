import ProductTab from './productTabs';
import ProductsRelatedProduct from './productsRelatedProduct';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {Routes} from '~/lib/constants/routes.constent';
import {FC, ReactNode} from 'react';
import {json, useLoaderData} from '@remix-run/react';
import WelderHelment from 'public/weld-helmet.png';
import ProductInformation from './productInformation';

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
  name: string;
  isFavorited: boolean;
  productBuyPrice: number;
  productRRP: number;
  sku: string;
  unitOfMeasurement: string;
  isInStock: boolean;
  bulkPricings: {
    quantity: string;
    price: number;
  }[];
  pickUpLocation: string;
  pickUpReadyTime: string;
  similarProducts: SimilarProduct[];
};

async function getAProduct() {
  const productDetailsFromAPI = {
    name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
    imgUrl: '',
    isFavorited: false,
    productBuyPrice: 649.23423,
    productRRP: 79.234234,
    sku: '1-1601-EC',
    unitOfMeasurement: '1 Box',
    isInStock: true,
    bulkPricings: [
      {
        id: 1,
        quantity: '1-50',
        price: 732,
      },
      {
        id: 2,
        quantity: '100+',
        price: 500,
      },
      {
        id: 3,
        quantity: '1-50',
        price: 732,
      },
      {
        id: 4,
        quantity: '100+',
        price: 500,
      },
      {
        id: 5,
        quantity: '1-50',
        price: 732,
      },
      {
        id: 6,
        quantity: '100+',
        price: 500,
      },
      {
        id: 7,
        quantity: '1-50',
        price: 732,
      },
      {
        id: 8,
        quantity: '100+',
        price: 500,
      },
    ],
    pickUpLocation: 'SUPERCHEAP AUTO NZ PTY LTD',
    pickUpReadyTime: '4 hours',
    similarProducts: [
      {
        name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
        imageUrl: WelderHelment,
        isFavorited: true,
        isQtyBuyAvailable: true,
        productBuyPrice: 649.23423,
        productRRP: 79.234234,
        sku: '1-1601-EC',
      },
      {
        name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
        imageUrl: WelderHelment,
        isFavorited: true,
        isQtyBuyAvailable: true,
        productBuyPrice: 649.23423,
        productRRP: 79.234234,
        sku: '1-1601-EC',
      },
      {
        name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
        imageUrl: WelderHelment,
        isFavorited: false,
        isQtyBuyAvailable: true,
        productBuyPrice: 649.23423,
        productRRP: 79.234234,
        sku: '1-1601-EC',
      },
      {
        name: 'ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of CIGWELD Edition',
        imageUrl: WelderHelment,
        isFavorited: false,
        isQtyBuyAvailable: true,
        productBuyPrice: 649.23423,
        productRRP: 79.234234,
        sku: '1-1601-EC',
      },
    ],
  };
  return productDetailsFromAPI;
}

export const loader = async () => {
  const product = await getAProduct();
  return json({product});
};

export default function route() {
  const {product} = useLoaderData<typeof loader>();
  return (
    <ProductDetailPageWrapper>
      <ProductDetailPageBreadCrumb title={product.name} />
      <ProductInformation product={product} />
      <ProductTab />
      <ProductsRelatedProduct products={product.similarProducts} />
    </ProductDetailPageWrapper>
  );
}

const ProductDetailPageWrapper = ({children}: {children: ReactNode}) => {
  return <div className="container">{children}</div>;
};

const ProductDetailPageBreadCrumb = ({title}: {title: string}) => {
  return (
    <>
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
            {title}
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
    </>
  );
};
