import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/server-runtime';
import {
  PredictiveCollectionFragment,
  PredictiveProductFragment,
} from 'storefrontapi.generated';
import {CART_SESSION_KEY} from '~/lib/constants/cartInfo.constant';
import {getAccessToken, isAuthenticate} from '~/lib/utils/auth-session.server';
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from '~/lib/utils/toast-session.server';
import {getUserDetails} from '~/lib/utils/user-session.server';
import {getCartList} from '../_app.cart-list/cart.server';
import {addProductToCart} from '../_app.product_.$productSlug/product.server';
import {getPredictiveSearch} from './predictiveSearch.server';

type PredicticeSearchResultItemImage =
  | PredictiveCollectionFragment['image']
  | PredictiveProductFragment['variants']['nodes'][0]['image'];

export type NormalizedPredictiveSearchResultItem = {
  __typename: string | undefined;
  handle: string;
  id: string;
  image?: PredicticeSearchResultItemImage;
  styledTitle?: string;
  title: string;
  url: string;
  moq: string;
  sku: string;
  price: string;
  currency: string;
  uom: string;
  uomCode: string;
  variantId: string;
  unitOfMeasure: {unit: string; code: string; conversionFactor: number}[];
  defaultUomValue: string;
  featuredImageUrl: string;
  currencySymbol: string;
};

type NormalizedPredictiveSearchResults = {
  type: 'products';
  items: Array<NormalizedPredictiveSearchResultItem>;
};

export type NormalizedPredictiveSearch = {
  results: NormalizedPredictiveSearchResults;
};

export async function loader({context, request}: LoaderFunctionArgs) {
  await isAuthenticate(context);

  const {searchParams} = new URL(request.url);
  const {userDetails} = await getUserDetails(request);
  const searchTerm = searchParams.get('searchTerm');
  if (searchTerm) {
    const results = await getPredictiveSearch({
      context,
      request,
      customerID: userDetails?.id,
      searchTerm,
    });

    return json({results});
  }
  return null;
}

export const action = async ({request, context}: ActionFunctionArgs) => {
  const messageSession = await getMessageSession(request);
  const fromData = await request.formData();
  let sessionCartInfo = await context.session.get(CART_SESSION_KEY);
  try {
    const cartInfo = Object.fromEntries(fromData);
    const accessTocken = (await getAccessToken(context)) as string;
    const addToCart = await addProductToCart(
      cartInfo,
      accessTocken,
      context,
      request,
    );
    await getCartList(context, request, sessionCartInfo);
    setSuccessMessage(messageSession, 'Item added to cart successfully');
    return redirect('/cart-list', {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  } catch (error) {
    if (error instanceof Error) {
      await getCartList(context, request, sessionCartInfo);
      console.log('this is err', error?.message);
      setErrorMessage(messageSession, error?.message);
      return redirect('/cart-list', {
        headers: [
          ['Set-Cookie', await context.session.commit({})],
          ['Set-Cookie', await messageCommitSession(messageSession)],
        ],
      });
    }
    console.log('this is err');
    setErrorMessage(
      messageSession,
      'Item not added to cart. Please try again later.',
    );
    return redirect('/cart-list', {
      headers: [
        ['Set-Cookie', await context.session.commit({})],
        ['Set-Cookie', await messageCommitSession(messageSession)],
      ],
    });
  }
};
