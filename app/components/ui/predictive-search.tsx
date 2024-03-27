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
import {CompareSearch} from '../icons/compareSearch';

export type SearchVariant =
  | 'normal'
  | 'cart'
  | 'pending_order'
  | 'compare'
  | 'place_an_order';

/**
 * Renders a predictive search component.
 * @returns {JSX.Element} rendered predictive search component.
 */
export function PredictiveSearch({
  inputPlaceholder = 'Search Product or SKU Number',
  searchVariant = 'normal',
}: {
  inputPlaceholder?: string;
  searchVariant: SearchVariant;
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
        className="relative flex items-center w-full"
      >
        <span className="absolute top-1/3">
          {searchVariant === 'compare' ? (
            <CompareSearch />
          ) : (
            <FaSearch className="fill-primary-500" />
          )}
        </span>
        <input
          type="text"
          name="searchTerm"
          placeholder={inputPlaceholder}
          className={`!pl-6 border-none w-full text-base ${
            searchVariant === 'compare'
              ? 'font-normal'
              : 'font-bold placeholder:italic'
          } text-grey-900 placeholder:text-grey-900 focus:bg-white`}
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
            searchVariant === 'cart' ||
            searchVariant === 'compare' ||
            searchVariant === 'pending_order'
              ? 'max-w-[550px] max-h-[350px] overflow-y-auto shadow-lg'
              : null
          }`}
        >
          {fetcher.state === 'loading' ? (
            <p className="text-base font-bold text-center text-grey-400">
              Loading...
            </p>
          ) : searchResults?.results?.length > 0 ? (
            searchResults?.results.map((result) => {
              switch (result.type) {
                case 'products':
                  return (
                    <SearchResultsProductsGrid
                      key={result.type}
                      products={result.items}
                      setSearchProduct={setSearchProduct}
                      searchVariant={searchVariant}
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
            <p className="text-base font-bold text-center text-grey-400">
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
  searchVariant,
}: {
  products: Array<NormalizedPredictiveSearchResultItem>;
  setSearchProduct: React.Dispatch<React.SetStateAction<boolean>>;
  searchVariant: SearchVariant;
}) {
  /**
   * @param product
   * @returns rendered grid of product search results based on search variant type.
   */
  function renderProductItem(product: NormalizedPredictiveSearchResultItem) {
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

    console.log('search proudct', product);

    switch (searchVariant) {
      case 'normal': {
        return (
          <figure className="flex items-center space-x-4" key={product.id}>
            <div className="size-14">
              <img
                src={productUrl}
                alt="product-image"
                className="object-cover object-center size-full"
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
      }
      case 'cart': {
        return (
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-16">
                <img
                  src={productUrl}
                  alt="product-image"
                  className="object-contain object-center size-full"
                />
              </div>
              <div>
                <p className="text-sm text-primary-500">
                  SKU: <span>{product.sku}</span>
                </p>
                <p>
                  <Link
                    prefetch="intent"
                    to={`/product/${product.handle}`}
                    onClick={() => setSearchProduct(false)}
                    className="text-base font-medium text-grey-900"
                  >
                    {product.title}
                  </Link>
                </p>
                <p className="text-2xl italic font-bold text-grey-900">
                  {product?.currency || '$'}
                  {product?.price}
                  <span className="text-sm italic font-bold text-grey-500">
                    {' '}
                    (Excl. GST)
                  </span>
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
              {quantity < Number(product.moq) || quantity < 1 ? (
                <>
                  <Button
                    variant="primary"
                    className="px-8 mt-2 cursor-not-allowed bg-grey-500"
                    disabled
                  >
                    Add to Cart
                  </Button>
                  <p className="text-xs text-red-500">
                    Minimum Order Quantity {product?.moq || 1}
                  </p>
                </>
              ) : (
                <Form
                  method="POST"
                  action="/predictive-search"
                  onSubmit={(event) => {
                    submit(event.currentTarget);
                    setSearchProduct(false);
                  }}
                  className="w-full"
                >
                  <input type="hidden" name="productId" value={product?.id} />
                  <input
                    type="hidden"
                    name="productVariantId"
                    value={product?.variantId}
                  />
                  <input type="hidden" name="quantity" value={quantity} />
                  <input type="hidden" name="selectUOM" value={product?.uom} />
                  <Button variant="primary" className="px-8 mt-2">
                    Add to Cart
                  </Button>
                </Form>
              )}
            </div>
          </div>
        );
      }
      case 'pending_order': {
        return (
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-16">
                <img
                  src={productUrl}
                  alt="product-image"
                  className="object-contain object-center size-full"
                />
              </div>
              <div>
                <p className="text-sm text-primary-500">
                  SKU: <span>{product.sku}</span>
                </p>
                <p>
                  <Link
                    prefetch="intent"
                    to={`/product/${product.handle}`}
                    onClick={() => setSearchProduct(false)}
                    className="text-base font-medium text-grey-900"
                  >
                    {product.title}
                  </Link>
                </p>
                <p className="text-2xl italic font-bold text-grey-900">
                  {product?.currency || '$'}
                  {product?.price}
                  <span className="text-sm italic font-bold text-grey-500">
                    {' '}
                    (Excl. GST)
                  </span>
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
              {quantity < Number(product.moq) || quantity < 1 ? (
                <>
                  <Button
                    variant="primary"
                    className="px-8 mt-2 cursor-not-allowed bg-grey-500"
                    disabled
                  >
                    Add to List
                  </Button>
                  <p className="text-xs text-red-500">
                    Minimum Order Quantity {product?.moq || 1}
                  </p>
                </>
              ) : (
                <Form
                  method="POST"
                  onSubmit={(event) => {
                    submit(event.currentTarget);
                    setSearchProduct(false);
                  }}
                  className="w-full"
                >
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={quantity} />
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-8 mt-2"
                    name="_action"
                    value="add_product"
                  >
                    Add to List
                  </Button>
                </Form>
              )}
            </div>
          </div>
        );
      }
      case 'compare': {
        return (
          <figure className="flex items-center space-x-4" key={product.id}>
            <div className="size-14">
              <img
                src={productUrl}
                alt="product-image"
                className="object-cover object-center size-full"
              />
            </div>
            <figcaption>
              <Link
                prefetch="intent"
                to={product.id}
                onClick={() => setSearchProduct(false)}
                className="text-base font-bold text-grey-900"
              >
                {product.title}
              </Link>
            </figcaption>
          </figure>
        );
      }
      case 'place_an_order': {
        return (
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-16">
                <img
                  src={productUrl}
                  alt="product-image"
                  className="object-contain object-center size-full"
                />
              </div>
              <div>
                <p className="text-sm text-primary-500">
                  SKU: <span>{product.sku}</span>
                </p>
                <p>
                  <Link
                    prefetch="intent"
                    to={`/product/${product.handle}`}
                    onClick={() => setSearchProduct(false)}
                    className="text-base font-medium text-grey-900"
                  >
                    {product.title}
                  </Link>
                </p>
                <p className="text-2xl italic font-bold text-grey-900">
                  {product?.currency || '$'}
                  {product?.price}
                  <span className="text-sm italic font-bold text-grey-500">
                    {' '}
                    (Excl. GST)
                  </span>
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
              {quantity < Number(product.moq) || quantity < 1 ? (
                <>
                  <Button
                    variant="primary"
                    className="px-8 mt-2 cursor-not-allowed bg-grey-500"
                    disabled
                  >
                    Add to List
                  </Button>
                  <p className="text-xs text-red-500">
                    Minimum Order Quantity {product?.moq || 1}
                  </p>
                </>
              ) : (
                <Form
                  method="POST"
                  onSubmit={(event) => {
                    submit(event.currentTarget);
                    setSearchProduct(false);
                  }}
                  className="w-full"
                >
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={quantity} />
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-8 mt-2"
                    name="_action"
                    value="add_product"
                  >
                    Add to List
                  </Button>
                </Form>
              )}
            </div>
          </div>
        );
      }
      default:
        break;
    }
  }

  return (
    <div className="grid gap-y-4">
      {searchVariant === 'cart' && <h5>Recommended Products</h5>}
      {products.map((product) => {
        return renderProductItem(product);
      })}
    </div>
  );
}
