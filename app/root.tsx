import {useEffect} from 'react';
import {displayToast} from '~/components/ui/toast';
import {Toaster} from '~/components/ui/toaster';
import {useNonce} from '@shopify/hydrogen';
import tailwindStyles from '~/styles/tailwind.css';
import favicon from '../public/logo_main.svg';
import nProgressStyles from 'nprogress/nprogress.css';
import {
  type SerializeFrom,
  type LoaderFunctionArgs,
  json,
} from '@shopify/remix-oxygen';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  ToastMessage,
  getMessageSession,
  messageCommitSession,
} from '~/lib/utils/toast-session.server';
import {useGlobalLoader} from './hooks/useGlobalLoader';
import {PageNotFound} from './components/ui/page-not-found';
import pdfAnnotationLayerStyles from 'react-pdf/dist/Page/AnnotationLayer.css';
import pdfTextLayerStyles from 'react-pdf/dist/Page/TextLayer.css';
/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: tailwindStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'stylesheet', href: nProgressStyles},
    {rel: 'stylesheet', href: pdfAnnotationLayerStyles},
    {rel: 'stylesheet', href: pdfTextLayerStyles},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({request}: LoaderFunctionArgs) {
  const messageSession = await getMessageSession(request);

  const toastMessage = messageSession.get('toastMessage') as ToastMessage;

  if (!toastMessage) {
    return json({toastMessage: null});
  }

  if (!toastMessage.type) {
    throw new Error('Message should have a type');
  }

  return json(
    {toastMessage},
    {headers: {'Set-Cookie': await messageCommitSession(messageSession)}},
  );
}

export default function App() {
  const nonce = useNonce();

  const {toastMessage} = useLoaderData<typeof loader>();

  useGlobalLoader();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const {message, type} = toastMessage;

    switch (type) {
      case 'success':
        displayToast({message, type});
        break;
      case 'error':
        displayToast({message, type});
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="relative">
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
        <Toaster />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  console.log('rootData', rootData);

  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <PageNotFound />
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}
