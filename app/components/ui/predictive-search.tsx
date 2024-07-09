import { Form, Link, useFetcher, useSubmit } from '@remix-run/react';
import { FormEvent, useRef, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import CloseMenu from '~/components/icons/closeMenu';
import { Button } from '~/components/ui/button';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { CART_QUANTITY_MAX, PRODUCT_MAX_PRICE } from '~/lib/constants/cartInfo.constant';
import { Can } from '~/lib/helpers/Can';
import { debounce } from '~/lib/helpers/general.helper';
import {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResultItem,
} from '~/routes/_app.predictive-search/route';
import { CompareSearch } from '../icons/compareSearch';
import { Routes } from '~/lib/constants/routes.constent';

export type SearchVariant =
  | 'normal'
  | 'mobile'
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

  const debounceSubmit = debounce(
    (form: HTMLFormElement) =>
      fetcher.submit(form, {
        method: 'GET',
        action: '/predictive-search',
      }),
    300,
  );

  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement> | FormEvent<HTMLFormElement>) =>
    debounceSubmit(event.currentTarget as HTMLFormElement);

  const handleClose = () => {
    setSearchProduct(false);
    const searchTermInput = searchFormRef.current?.querySelector(
      'input[name="searchTerm"]',
    ) as HTMLInputElement;
    if (searchTermInput) {
      searchTermInput.value = '';
    }
  };

  useOutsideClick(searchResultRef, () => handleClose());

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
        {searchVariant === 'mobile' ? (
          <input
            type="text"
            name="searchTerm"
            placeholder="Search product or part number"
            className="w-full text-white bg-transparent border-none outline-none focus:bg-transparent placeholder:text-white"
          />
        ) : (
          <>
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
              className={`!pl-6 border-none w-full text-base ${searchVariant === 'compare'
                ? 'font-normal'
                : 'font-bold placeholder:italic'
                } text-grey-900 placeholder:text-grey-900 focus:bg-white`}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleSubmit(event);
                  setSearchProduct(true);
                }
              }}
            />
          </>
        )}
        {searchVariant !== 'mobile' && searchProduct && (
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
          className={`${searchVariant === 'mobile' ? 'top-[65px]' : 'top-[calc(100%_+_4px)]'
            } bg-white absolute left-0 w-full z-20 py-4 px-6 space-y-4 ${searchVariant === 'normal' || searchVariant === 'mobile' || searchVariant === 'compare'
              ? "max-h-[calc(100vh_-_350px)] md:max-h-[calc(100vh_-_500px)] overflow-y-auto"
              : 'max-w-[650px] max-h-[350px] overflow-y-auto shadow-lg'
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
                      handleClose={handleClose}
                      products={result.items}
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
 * @returns rendered grid of product search results based on search variant type.
 */
function renderProductItem(
  product: NormalizedPredictiveSearchResultItem,
  searchVariant: SearchVariant,
  handleClose: () => void,
) {
  const [quantity, setQuantity] = useState(1);

  function decreaseQuantity() {
    if (isNaN(quantity - 1)) {
      setQuantity(1);
      return;
    }
    setQuantity(quantity - 1);
  }

  function increaseQuantity() {
    if (isNaN(quantity + 1)) {
      setQuantity(1);
      return;
    }
    setQuantity(quantity + 1);
  }

  function handleInputChange(event?: any) {
    const inputQuantity = parseInt(event.target.value);
    setQuantity(inputQuantity);
  }

  const submit = useSubmit();

  switch (searchVariant) {
    case 'normal': {
      return (
        <figure
          className="flex flex-wrap items-center space-x-4"
          key={product.id}
        >
          <div className="size-14">
            <Link
              prefetch="intent"
              to={product.handle ? `/product/${product.handle}` : "#"}
              onClick={handleClose}
            >
              <img
                src={product?.featuredPriceImageUrl}
                alt="product"
                className="object-cover object-center size-full"
              />
            </Link>
          </div>
          <figcaption className="w-[calc(100%_-_72px)]">
            <Link
              prefetch="intent"
              to={product.handle ? `/product/${product.handle}` : "#"}
              onClick={handleClose}
              className="text-base font-bold text-grey-900"
            >
              {product.title}
            </Link>
            <p className="text-sm text-primary-500">
              SKU: <span>{product.sku}</span>
            </p>
          </figcaption>
        </figure>
      );
    }
    case 'cart': {
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 sm:flex-row"
        >
          <div className="flex flex-wrap items-center gap-3 sm:w-4/6">
            <div className="size-16">
              <Link
                prefetch="intent"
                to={product.handle ? `/product/${product.handle}` : "#"}
                onClick={handleClose}
              >
                <img
                  src={product?.featuredPriceImageUrl}
                  alt="product"
                  className="object-contain object-center size-full"
                />
              </Link>
            </div>
            <div className="w-[calc(100%_-_76px)]">
              <p className="text-sm text-primary-500">
                SKU: <span>{product.sku}</span>
              </p>
              <p>
                <Link
                  prefetch="intent"
                  to={product.handle ? `/product/${product.handle}` : "#"}
                  onClick={handleClose}
                  className="text-base font-medium text-grey-900"
                >
                  {product.title}
                </Link>
              </p>
              <p className="text-2xl italic font-bold text-grey-900 whitespace-nowrap">
                {product?.currency || '$'}&nbsp;{product?.currencySymbol}
                {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ? product?.price : "N/A"}
                <span className="text-sm italic font-bold text-grey-500">
                  {' '}
                  (Excl. GST)
                </span>
              </p>
              <p className="text-sm text-grey-300">Minimum Order Quantity: {product.moq || 1}</p>
            </div>
          </div>
          {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ?
            <div className="sm:w-[calc(33.33%_-_1rem)]">
              <div className="flex cart__list--quantity">
                <button
                  className={`flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial ${quantity - 1 < 1
                    ? 'cursor-not-allowed'
                    : ''
                    }`}
                  onClick={decreaseQuantity}
                  disabled={quantity - 1 < 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="flex-1 text-center border-x-0 !border-grey-500 sm:min-w-20"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button
                  className="flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              {quantity < 1 ||
                quantity > CART_QUANTITY_MAX ||
                isNaN(quantity) ? (
                <>
                  <Can I="view" a="add_to_cart">
                    <Button
                      variant="primary"
                      className="w-full mt-2 cursor-not-allowed bg-grey-500"
                      disabled
                    >
                      Add to Cart
                    </Button>
                  </Can>
                  <p className="text-xs text-red-500">
                    Minimum Order Quantity 1
                    <br />
                    Maximum Quantity {CART_QUANTITY_MAX}
                  </p>
                </>
              ) : (
                <Can I="view" a="add_to_cart">
                  <Form
                    method="POST"
                    action="/predictive-search"
                    onSubmit={(event) => {
                      submit(event.currentTarget);
                      handleClose();
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
                    <Button
                      variant="primary"
                      className="w-full px-8 mt-2 whitespace-nowrap"
                    >
                      Add to Cart
                    </Button>
                  </Form>
                </Can>
              )}
            </div>
            : null}
        </div>
      );
    }
    case 'pending_order': {
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 sm:flex-row"
        >
          <div className="flex flex-wrap items-center gap-3 sm:w-4/6">
            <div className="size-16">
              <Link
                prefetch="intent"
                to={product.handle ? `/product/${product.handle}` : "#"}
                onClick={handleClose}
              >
                <img
                  src={product?.featuredPriceImageUrl}
                  alt="product"
                  className="object-contain object-center size-full"
                />
              </Link>
            </div>
            <div className="w-[calc(100%_-_76px)]">
              <p className="text-sm text-primary-500">
                SKU: <span>{product.sku}</span>
              </p>
              <p>
                <Link
                  prefetch="intent"
                  to={product.handle ? `/product/${product.handle}` : "#"}
                  onClick={handleClose}
                  className="text-base font-medium text-grey-900"
                >
                  {product.title}
                </Link>
              </p>
              <p className="text-2xl italic font-bold text-grey-900 whitespace-nowrap">
                {product?.currency || '$'}&nbsp;{product?.currencySymbol}
                {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ? product?.price : 'N/A'}
                <span className="text-sm italic font-bold text-grey-500">
                  {' '}
                  (Excl. GST)
                </span>
              </p>
              <p className="text-sm text-grey-300">Minimum Order Quantity: {product.moq || 1}</p>
            </div>
          </div>
          {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ?
            <div className="sm:w-[calc(33.33%_-_1rem)]">
              <div className="flex cart__list--quantity">
                <button
                  className={`flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial ${quantity - 1 < 1
                    ? 'cursor-not-allowed'
                    : ''
                    }`}
                  onClick={decreaseQuantity}
                  disabled={quantity - 1 < 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="flex-1 text-center border-x-0 !border-grey-500 sm:min-w-20"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button
                  className="flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              {quantity < 1 ||
                quantity > CART_QUANTITY_MAX ||
                isNaN(quantity) ? (
                <>
                  <Button
                    variant="primary"
                    className="w-full mt-2 cursor-not-allowed bg-grey-500"
                    disabled
                  >
                    Add to List
                  </Button>
                  <p className="text-xs text-red-500">
                    Minimum Order Quantity 1
                    <br />
                    Maximum Quantity {CART_QUANTITY_MAX}
                  </p>
                </>
              ) : (
                <Form
                  method="POST"
                  onSubmit={(event) => {
                    submit(event.currentTarget);
                    handleClose();
                  }}
                  className="w-full"
                >
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={quantity} />
                  <input type="hidden" name="uom" value={product.uom} />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full px-8 mt-2 whitespace-nowrap"
                    name="_action"
                    value="add_product"
                  >
                    Add to List
                  </Button>
                </Form>
              )}
            </div>
            : null}
        </div>
      );
    }
    case 'compare': {
      return (
        <figure
          key={product.id}
          className="flex flex-wrap items-center space-x-4"
        >
          <div className="size-14">
            <Link
              prefetch="intent"
              to={product.id}
              onClick={handleClose}
            >
              <img
                src={product?.featuredPriceImageUrl}
                alt="product"
                className="object-cover object-center size-full"
              />
            </Link>
          </div>
          <figcaption className="w-[calc(100%_-_72px)]">
            <Link
              prefetch="intent"
              to={product.id}
              onClick={handleClose}
              className="text-base font-bold text-grey-900"
            >
              {product.title}
            </Link>
            <p className="text-sm text-primary-500">
              SKU: <span>{product.sku}</span>
            </p>
          </figcaption>
        </figure>
      );
    }
    case 'place_an_order': {
      const [UOM, setUOM] = useState(product.uomCode);
      function handleUOM(selectedUOM: string) {
        setUOM(selectedUOM);
      }
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 sm:flex-row"
        >
          <div className="flex flex-wrap items-center gap-3 sm:w-2/5">
            <div className="size-16">
              <Link
                prefetch="intent"
                to={product.handle ? `/product/${product.handle}` : "#"}
                onClick={handleClose}
              >
                <img
                  src={product?.featuredPriceImageUrl}
                  alt="product"
                  className="object-contain object-center size-full"
                />
              </Link>
            </div>
            <div className="w-[calc(100%_-_76px)]">
              <p className="text-sm text-primary-500">
                SKU: <span>{product.sku}</span>
              </p>
              <p>
                <Link
                  prefetch="intent"
                  to={product.handle ? `/product/${product.handle}` : "#"}
                  onClick={handleClose}
                  className="text-base font-medium text-grey-900"
                >
                  {product.title}
                </Link>
              </p>
              <p className="text-2xl italic font-bold text-grey-900 whitespace-nowrap">
                {product?.currency || '$'}&nbsp;{product?.currencySymbol}
                {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ? product?.price : 'N/A'}
                <span className="text-sm italic font-bold text-grey-500">
                  {' '}
                  (Excl. GST)
                </span>
              </p>
              <p className="text-sm text-grey-300">Minimum Order Quantity: {product.moq || 1}</p>
            </div>
          </div>
          {product?.price && Number(product?.price) < PRODUCT_MAX_PRICE ?
            <div className="grid grid-cols-1 gap-x-4 w-full gap-y-2 sm:grid-cols-2 sm:w-[calc(60%_-_1rem)] items-end">
              <p className='font-medium'>Unit of Measure</p>
              <div className="flex cart__list--quantity">
                <button
                  className={`flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial ${quantity - 1 < 1
                    ? 'cursor-not-allowed'
                    : ''
                    }`}
                  onClick={decreaseQuantity}
                  disabled={quantity - 1 < 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="flex-1 text-center border-x-0 !border-grey-500 sm:min-w-20"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button
                  className="flex items-center justify-center flex-1 border border-grey-500 sm:w-10 sm:flex-initial"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>
              <select
                name="filter_by"
                className="w-full min-w-[120px] place-order !border-grey-500 filter-select !py-[9px]"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleUOM(e.target.value)
                }
                defaultValue={UOM}
              >
                {product.unitOfMeasure?.length > 0 ? (
                  product.unitOfMeasure?.map(
                    (uom: { unit: string; code: string }, index: number) => (
                      <option
                        className="px-4"
                        value={uom.code}
                        key={index + 'uom'}
                      >
                        {uom.unit}
                      </option>
                    ),
                  )
                ) : (
                  <option value={UOM}>{product.defaultUomValue}</option>
                )}
              </select>
              {quantity < 1 ||
                quantity > CART_QUANTITY_MAX ||
                isNaN(quantity) ? (
                <>
                  <Button
                    variant="primary"
                    className="px-8 cursor-not-allowed bg-grey-500 whitespace-nowrap"
                    disabled
                  >
                    Add to List
                  </Button>
                  <div className="hidden sm:block"></div>
                  <p className="w-full text-xs text-red-500">
                    Minimum Order Quantity 1
                    <br />
                    Maximum Quantity {CART_QUANTITY_MAX}
                  </p>
                </>
              ) : (
                <Form
                  method="POST"
                  onSubmit={(event) => {
                    submit(event.currentTarget);
                    handleClose();
                  }}
                  className="w-full"
                >
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="quantity" value={quantity} />
                  <input type="hidden" name="uom" value={UOM} />
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full px-8 whitespace-nowrap"
                    name="_action"
                    value="add_product"
                  >
                    Add to List
                  </Button>
                </Form>
              )}
            </div>
            : null}
        </div>
      );
    }
    case 'mobile': {
      return (
        <figure
          className="flex flex-wrap items-center space-x-4"
          key={product.id}
        >
          <div className="size-14">
            <Link
              prefetch="intent"
              to={product.handle ? `/product/${product.handle}` : "#"}
              onClick={handleClose}
            >
              <img
                src={product?.featuredPriceImageUrl}
                alt="product"
                className="object-cover object-center size-full"
              />
            </Link>
          </div>
          <figcaption className="w-[calc(100%_-_72px)]">
            <Link
              prefetch="intent"
              to={product.handle ? `/product/${product.handle}` : "#"}
              onClick={handleClose}
              className="text-base font-bold text-grey-900"
            >
              {product.title}
            </Link>
            <p className="text-sm text-primary-500">
              SKU: <span>{product.sku}</span>
            </p>
          </figcaption>
        </figure>
      );
    }
    default:
      break;
  }
}

/**
 * Renders a grid of product search results.
 * @param {Array<NormalizedPredictiveSearchResultItem>} products - The array of product search results.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setSearchProduct - The state setter for the search product.
 * @returns {JSX.Element} rendered grid of product search results.
 */
function SearchResultsProductsGrid({
  products,
  searchVariant,
  handleClose,
}: {
  products: Array<NormalizedPredictiveSearchResultItem>;
  searchVariant: SearchVariant;
  handleClose: () => void;
}) {
  return (
    <>
      <div className="grid gap-y-4">
        {searchVariant === 'cart' && <h5>Recommended Products</h5>}
        {products.map((product) => {
          return renderProductItem(product, searchVariant, handleClose);
        })}
      </div>
      <div>
        <Link to={Routes.CATEGORIES} onClick={handleClose} className='flex items-center justify-center px-6 py-2 text-sm font-bold leading-6 uppercase duration-150 border-solid cursor-pointer bg-secondary-500 hover:bg-secondary-500 text-grey-900'>View all</Link>
      </div>
    </>
  );
}
