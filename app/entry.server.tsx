import type { EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const localDirectives =
    process.env.NODE_ENV === 'development' ? ['localhost:*'] : [];

  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      'fonts.gstatic.com',
      'cdn.shopify.com',
      'shopify.com',
      'http://cdnjs.cloudflare.com',
      ...localDirectives,
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'fonts.googleapis.com',
      'cdn.shopify.com',

      ...localDirectives,
    ],
    frameSrc: [
      "'self'",
      'youtube.com',
      'https://www.youtube.com/',
      'pimcoredata.intuji.com',
      'https://pimcoredata.intuji.com/',
      ...localDirectives,
    ],
    connectSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://pimcoredata.intuji.com',
      'https://cig-backend.webo.dev',
      'https://www.w3.org',
      'https://cigweld-middleware.intuji.com',
      ...localDirectives,
    ],
    mediaSrc: [
      "'self'",
      'pimcoredata.intuji.com',
      'https://pimcoredata.intuji.com/',
      ...localDirectives,
    ],
    imgSrc: [
      "'self'",
      'data:',
      'cdn.shopify.com',
      'picsum.photos',
      'fastly.picsum.photos',
      'swiperjs.com',
      'casual-mink-routinely.ngrok-free.app',
      'shermacbucket.sgp1.digitaloceanspaces.com', // For default images domain, must be removed
      'relaxing-hawk-ace.ngrok-free.app',
      'cig-backend.webo.dev',
      'pimcoredata.intuji.com',
      ...localDirectives,
    ],
    workerSrc: [
      'blob:',
      'http://cdnjs.cloudflare.com',
      'http://localhost:4000',
      'https://pimcoredata.intuji.com',
      ...localDirectives,
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
