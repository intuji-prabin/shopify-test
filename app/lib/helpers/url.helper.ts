/**
 * Generates a URL with query parameters.
 * @param {string} params.url - The base URL.
 * @param {Request} params.request - The request object containing the search parameters.
 * @param {string[]} params.params - The list of parameter names to include in the URL.
 * @returns {string} The generated URL with query parameters.
 */
export function generateUrlWithParams({
  url,
  request,
  params,
}: {
  url: string;
  params: string[];
  request: Request;
}) {
  const {searchParams} = new URL(request.url);

  params.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      url += `${param}=${value}&`;
    }
  });

  // Remove the trailing '&' if it exists
  if (url.endsWith('&')) {
    url = url.slice(0, -1);
  }

  return url;
}
