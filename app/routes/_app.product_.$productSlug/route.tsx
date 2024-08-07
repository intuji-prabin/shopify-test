import {
  isRouteErrorResponse,
  json,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@remix-run/server-runtime';
import {ReactNode} from 'react';
import {AuthError} from '~/components/ui/authError';
import {BackButton} from '~/components/ui/back-button';
import {Breadcrumb, BreadcrumbItem} from '~/components/ui/breadcrumb';
import {ProductCard} from '~/components/ui/product-card';
import {RouteError} from '~/components/ui/route-error';
import {useConditionalRender} from '~/hooks/useAuthorization';
import {getAccessToken, isImpersonating} from '~/lib/utils/auth-session.server';
import {encrypt} from '~/lib/utils/cryptoUtils';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {
  ProductType,
  addProductToCart,
  getProductDetails,
} from './product.server';
import ProductInformation from './productInformation';
import {addToWishlist, removeFromWishlist} from './wishlist.server';
import {AuthErrorHandling} from '~/lib/utils/authErrorHandling';
import {ProductList} from '../_app.category_.$mainCategorySlug_.($categorySlug)_.($subCategorySlug)/productList.server';
import {ProductTab} from './productTabs';

interface ProductDetailType {
  productPage: string;
  encryptedSession: string;
  impersonateEnableCheck: string;
  product: {
    productInfo: ProductInfoType;
    productTab: ProductTabType;
    relatedProducts: ProductList[];
    alternativeProduct: ProductList[];
  };
}

export interface ProductInfoType {
  productInfo: Pick<
    ProductType,
    | 'id'
    | 'title'
    | 'tags'
    | 'thumbnailImage'
    | 'uom'
    | 'uomCode'
    | 'unitOfMeasure'
    | 'imageUrl'
    | 'liked'
    | 'variantId'
    | 'supplierSku'
    | 'variantTitle'
    | 'moq'
    | 'compareAtPrice'
    | 'originalPrice'
    | 'companyDefaultPrice'
    | 'priceRange'
    | 'currency'
  >;
}

export interface ProductTabType {
  productTab: Pick<
    ProductType,
    | 'description'
    | 'warranty'
    | 'productWeight'
    | 'supplier'
    | 'specification'
    | 'packageContent'
    | 'features'
    | 'faq'
    | 'brochure'
    | 'video'
    | 'download'
    | 'serviceManual'
    | 'operatingManual'
    | 'brand'
  >;
}

export const loader = async ({
  params,
  request,
  context,
}: LoaderFunctionArgs) => {
  try {
    const {productSlug} = params;
    const {userDetails} = await getUserDetails(request);
    const impersonateEnableCheck = await isImpersonating(request);
    const sessionAccessTocken = (await getAccessToken(context)) as string;
    const encryptedSession = encrypt(sessionAccessTocken);

    const product = await getProductDetails(
      context,
      request,
      userDetails?.id,
      productSlug as string,
    );

    const productPage = params.productSlug;

    return json({
      product,
      productPage,
      encryptedSession,
      impersonateEnableCheck,
    });
  } catch (error) {
    let message = "Couldn't load the product details. Please try again later.";
    if (error instanceof Error) {
      message = error.message;
    }
    throw new Error(message);
  }
};

export default function route() {
  const {product, productPage, encryptedSession, impersonateEnableCheck} =
    useLoaderData<ProductDetailType>();

  const shouldRender = useConditionalRender('view_product_detail');

  return (
    shouldRender && (
      <ProductDetailPageWrapper>
        <div className="flex items-center pt-6 pb-4 ">
          <BackButton title="" />
          <Breadcrumb>
            <BreadcrumbItem href="/categories" className="capitalize">
              Products
            </BreadcrumbItem>
            <BreadcrumbItem className="capitalize text-grey-800">
              {productPage?.split('-').join(' ')}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <ProductInformation product={product?.productInfo} />
        <ProductTab
          productTab={product?.productTab}
          alternateProduct={product.alternativeProduct}
          sessionAccessTocken={encryptedSession}
          impersonateEnableCheck={impersonateEnableCheck}
        />
        {product?.relatedProducts?.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container">
              <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase">
                Similar Products
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-[18px] similar__product">
                {product.relatedProducts?.slice(0, 4).map((product, index) => (
                  <ProductCard key={index} {...product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </ProductDetailPageWrapper>
    )
  );
}

const ProductDetailPageWrapper = ({children}: {children: ReactNode}) => {
  return <div className="container">{children}</div>;
};

export const action = async ({request, context}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);

  const fromData = await request.formData();
  switch (fromData.get('action')) {
    case 'addToCart': {
      try {
        const cartInfo = Object.fromEntries(fromData);
        const accessTocken = (await getAccessToken(context)) as string;
        const addToCart = await addProductToCart(
          cartInfo,
          accessTocken,
          context,
          request,
        );
        console.log('this is it');
        setSuccessMessage(messageSession, 'Item added to cart successfully');

        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not added to cart. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    case 'addToWishList': {
      try {
        const productInfo = Object.fromEntries(fromData);
        // console.log("productInfo", productInfo)
        await addToWishlist(productInfo, context, request);
        setSuccessMessage(
          messageSession,
          'Item added to wishlist successfully',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not added to wishlist. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    case 'removeFromWishList': {
      try {
        const productInfo = Object.fromEntries(fromData);
        await removeFromWishlist(productInfo, context, request);
        setSuccessMessage(
          messageSession,
          'Item removed from wishlist successfully',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          console.log('this is err', error?.message);
          setErrorMessage(messageSession, error?.message);
          return json(
            {},
            {
              headers: [
                ['Set-Cookie', await context.session.commit({})],
                ['Set-Cookie', await messageCommitSession(messageSession)],
              ],
            },
          );
        }
        console.log('this is err');
        setErrorMessage(
          messageSession,
          'Item not removed from the wishlist. Please try again later.',
        );
        return json(
          {},
          {
            headers: [
              ['Set-Cookie', await context.session.commit({})],
              ['Set-Cookie', await messageCommitSession(messageSession)],
            ],
          },
        );
      }
    }
    default: {
      throw new Error('Unknown action');
    }
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-[calc(100vh_-_140px)] flex justify-center items-center">
        <div className="text-center">
          <h1>
            {error.status} {error.statusText}
          </h1>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    if (AuthErrorHandling(error.message)) {
      return <AuthError errorMessage={error.message} />;
    }
    return (
      <div className="container">
        <RouteError errorMessage={error.message} />
      </div>
    );
  } else {
    return (
      <div className="min-h-[calc(100vh_-_140px)] flex justify-center items-center">
        <h1>Unknown Error</h1>
      </div>
    );
  }
}
