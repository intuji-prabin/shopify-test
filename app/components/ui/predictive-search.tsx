import {FormEvent, useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {Link, useFetcher} from '@remix-run/react';
import {debounce} from '~/lib/helpers/general.helper';
import {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResultItem,
} from '~/routes/_app.predictive-search/route';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {useOutsideClick} from '~/hooks/useOutsideClick';

export function PredictiveSearch() {
  const fetcher = useFetcher();

  // For handling the clicked outsite the search
  // const [searchProduct, setSearchProduct] = useState(false);
  // const searchResultRef = useRef<HTMLDivElement>(null);
  // useOutsideClick(searchResultRef, () => setSearchProduct(false));

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

  const searchResults = fetcher.data as NormalizedPredictiveSearch;

  return (
    <>
      <fetcher.Form
        method="GET"
        onChange={handleSubmit}
        className="relative w-full"
      >
        <span className="absolute top-1/3 ">
          <FaSearch className="fill-primary-500" />
        </span>
        <input
          type="search"
          name="searchTerm"
          placeholder="Search Product or SKU Number"
          className="!pl-6 border-none w-full placeholder:italic text-base font-bold text-grey-900 placeholder:text-grey-900 focus:bg-white"
        />
      </fetcher.Form>
      {fetcher.data && (
        <div className="bg-white absolute top-[52px] left-0 w-full z-20 py-4 px-6 space-y-4">
          {searchResults?.results.length > 0 ? (
            searchResults?.results.map((result) => {
              switch (result.type) {
                case 'products':
                  return (
                    <SearchResultsProductsGrid
                      key={result.type}
                      products={result.items}
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
    </>
  );
}

function SearchResultsProductsGrid({
  products,
}: {
  products: Array<NormalizedPredictiveSearchResultItem>;
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
