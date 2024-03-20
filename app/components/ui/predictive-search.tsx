import {FormEvent, useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {Form, Link, useFetcher, useSubmit} from '@remix-run/react';
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
export function PredictiveSearch({
  inputPlaceholder = 'Search Product or SKU Number',
  addToCart = false,
}: {
  inputPlaceholder?: string;
  addToCart?: boolean;
}) {
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
          placeholder={inputPlaceholder}
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
        <div
          className={`bg-white absolute top-[52px] left-0 w-full z-20 py-4 px-6 space-y-4 ${
            addToCart ? 'max-w-[550px] max-h-[350px] overflow-y-auto' : null
          }`}
        >
          {searchResults?.results?.length > 0 ? (
            searchResults?.results.map((result) => {
              switch (result.type) {
                case 'products':
                  return (
                    <SearchResultsProductsGrid
                      key={result.type}
                      products={result.items}
                      setSearchProduct={setSearchProduct}
                      addToCart={addToCart}
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
  addToCart,
}: {
  products: Array<NormalizedPredictiveSearchResultItem>;
  setSearchProduct: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart?: boolean;
}) {
  return (
    <div className="grid gap-y-4">
      {addToCart && <h5>Recommended Products</h5>}
      {products.map((product) => {
        const productUrl = product.image?.url
          ? product.image.url
          : DEFAULT_IMAGE.IMAGE;
        const [quantity, setQuantity] = useState(parseFloat(product.moq) || 1);
        function decreaseQuantity() {
          setQuantity(quantity > 0 ? quantity - 1 : 0);
        }
        function increaseQuantity() {
          setQuantity(quantity + 1);
        }
        function handleInputChange(event?: any) {
          const inputQuantity = parseInt(event.target.value);
          setQuantity(isNaN(inputQuantity) ? 0 : inputQuantity);
        }
        const submit = useSubmit();
        const productParts = product?.id?.split('/');
        const productId = productParts[productParts.length - 1];

        const variantParts = product?.variantId?.split('/');
        const variantId = variantParts[variantParts.length - 1];
        return (
          <>
            {!addToCart ? (
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
            ) : (
              <div className="flex gap-4 justify-between">
                <div className="flex gap-3 items-center">
                  <div className="size-16">
                    <img
                      src={productUrl}
                      alt="product-image"
                      className="size-full object-contain object-center"
                    />
                  </div>
                  <div>
                    <p>
                      SKU: <span>{product.sku}</span>
                    </p>
                    <p>
                      <Link
                        prefetch="intent"
                        to={`/product/${product.handle}`}
                        onClick={() => setSearchProduct(false)}
                        className="text-base font-bold text-grey-900"
                      >
                        {product.title}
                      </Link>
                    </p>
                    <p>
                      {product?.price?.currencyCode}
                      {product?.price?.amount}(Excl. GST)
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex">
                    <button
                      className="border-[1px] border-grey-500 flex justify-center items-center w-10 aspect-square"
                      onClick={decreaseQuantity}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="max-w-12 min-h-10 h-full text-center border-x-0 !border-grey-500"
                      value={quantity}
                      onChange={handleInputChange}
                    />
                    <button
                      className="border-[1px] border-grey-500  flex justify-center items-center aspect-square w-10"
                      onClick={increaseQuantity}
                    >
                      +
                    </button>
                  </div>
                  {quantity < product.moq || quantity < 1 ? (
                    <Button
                      variant="primary"
                      className="mt-2 px-8 bg-grey-500 cursor-not-allowed"
                      disabled
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Form
                      method="POST"
                      action="/predictive-search"
                      onSubmit={(event) => {
                        submit(event.currentTarget);
                      }}
                      className="w-full"
                    >
                      <input type="hidden" name="productId" value={productId} />
                      <input
                        type="hidden"
                        name="productVariantId"
                        value={variantId}
                      />
                      <input type="hidden" name="quantity" value={quantity} />
                      <input
                        type="hidden"
                        name="selectUOM"
                        value={product?.uom?.value}
                      />
                      <Button variant="primary" className="mt-2 px-8">
                        Add to Cart
                      </Button>
                    </Form>
                  )}
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
}
