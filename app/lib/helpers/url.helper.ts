/**
 * Generates a URL with query parameters.
 * @param {string} params.baseUrl - The base URL.
 * @param {Request} params.searchParams - The request object containing the search parameters.
 * @returns {string} The generated URL with query parameters.
 */
export function generateUrlWithParams({
  baseUrl,
  searchParams,
}: {
  baseUrl: string;
  searchParams: URLSearchParams;
}) {
  const paramsList = Object.fromEntries(searchParams);

  const url = new URL(baseUrl);

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(paramsList)) {
    if (key === 'after' || key === 'before') {
      params.append(key, 'true'); // This is a workaround for the Cursor-based pagination
    }
    if (value) {
      params.append(key, value);
    }
  }

  url.search = params.toString();
  return url.toString();
}
