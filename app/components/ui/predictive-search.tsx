import {FormEvent, useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {Link, useFetcher} from '@remix-run/react';
import {debounce} from '~/lib/helpers/general.helper';
import {Button} from '~/components/ui/button';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {useOutsideClick} from '~/hooks/useOutsideClick';
import CloseMenu from '~/components/icons/closeMenu';
import {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResultItem,
} from '~/routes/_app.predictive-search/route';

/**
 * Renders a predictive search component.
 * @returns {JSX.Element} rendered predictive search component.
 */
export function PredictiveSearch() {
  const [searchProduct, setSearchProduct] = useState(false);

  const searchResultRef = useRef<HTMLDivElement>(null);

  const searchFormRef = useRef<HTMLFormElement>(null);

  const fetcher = useFetcher();

  const searchResults = fetcher.data as NormalizedPredictiveSearch;

  useOutsideClick(searchResultRef, () => setSearchProduct(false));

  const debounceSubmit = debounce(
    (form: HTMLFormElement) =>
      fetcher.submit(form, {
        method: 'GET',
        action: '/predictive-search',
      }),
    300,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) =>
    debounceSubmit(event.currentTarget);

  const handleClose = () => {
    setSearchProduct(false);
    searchFormRef.current?.reset();
  };

  return (
    <div ref={searchResultRef} className="w-full">
      <fetcher.Form
        method="GET"
        onChange={(event) => {
          handleSubmit(event);
          setSearchProduct(true);
        }}
        ref={searchFormRef}
        className="relative w-full flex items-center"
      >
        <span className="absolute top-1/3 ">
          <FaSearch className="fill-primary-500" />
        </span>
        <input
          type="text"
          name="searchTerm"
          placeholder="Search Product or SKU Number"
          className="!pl-6 border-none w-full placeholder:italic text-base font-bold text-grey-900 placeholder:text-grey-900 focus:bg-white"
        />
        {searchProduct && (
          <Button
            className="p-0 bg-white hover:bg-white active:bg-white"
            onClick={handleClose}
          >
            {' '}
            <CloseMenu fillColor="#D92F28" />
          </Button>
        )}
      </fetcher.Form>
      {searchProduct && (
        <div className="bg-white absolute top-[52px] left-0 w-full z-20 py-4 px-6 space-y-4">
          {searchResults?.results?.length > 0 ? (
            searchResults?.results.map((result) => {
              switch (result.type) {
                case 'products':
                  return (
                    <SearchResultsProductsGrid
                      key={result.type}
                      products={result.items}
                      setSearchProduct={setSearchProduct}
                    />
                  );
                case 'queries':
                  // Suggestions product goes here if we need to integrate
                  break;
                default:
                  break;
              }
            })
          ) : (
            <p className="text-center text-base font-bold text-grey-400">
              No results found
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Renders a grid of product search results.
 * @param {Array<NormalizedPredictiveSearchResultItem>} products - The array of product search results.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSearchProduct - The state setter for the search product.
 * @returns {JSX.Element} rendered grid of product search results.
 */
function SearchResultsProductsGrid({
  products,
  setSearchProduct,
}: {
  products: Array<NormalizedPredictiveSearchResultItem>;
  setSearchProduct: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="grid gap-y-4">
      {products.map((product) => {
        const productUrl = product.image?.url
          ? product.image.url
          : DEFAULT_IMAGE.IMAGE;
        return (
          <figure className="flex items-center space-x-4" key={product.id}>
            <div className="size-14">
              <img
                src={productUrl}
                alt="product-image"
                className="size-full object-cover object-center"
              />
            </div>
            <figcaption>
              <Link
                prefetch="intent"
                to={`/product/${product.handle}`}
                onClick={() => setSearchProduct(false)}
                className="text-base font-bold text-grey-900"
              >
                {product.title}
              </Link>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
