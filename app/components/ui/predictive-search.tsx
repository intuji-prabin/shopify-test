import {Form, Link, useFetcher, useSubmit} from '@remix-run/react';
import {FormEvent, useRef, useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import CloseMenu from '~/components/icons/closeMenu';
import {Button} from '~/components/ui/button';
import {useOutsideClick} from '~/hooks/useOutsideClick';
import {CART_QUANTITY_MAX} from '~/lib/constants/cartInfo.constant';
import {Routes} from '~/lib/constants/routes.constent';
import {Can} from '~/lib/helpers/Can';
import {debounce} from '~/lib/helpers/general.helper';
import {
  NormalizedPredictiveSearch,
  NormalizedPredictiveSearchResultItem,
} from '~/routes/_app.predictive-search/route';
import {CompareSearch} from '../icons/compareSearch';
import {PredictiveProductDetail} from './predictiveSearchDetail';
import {PredictiveSearchFormError} from './predictiveSearchFormError';
import {PredictiveSearchMain} from './predictiveSearchMain';
import {PredictiveSearchQtyBtn} from './predictiveSearchQtyBtn';

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

  const handleSubmit = (
    event: React.KeyboardEvent<HTMLInputElement> | FormEvent<HTMLFormElement>,
  ) => debounceSubmit(event.currentTarget as HTMLFormElement);

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

  // Search class based on search variant
  let searchClass;
  switch (searchVariant) {
    case 'cart':
    case 'pending_order':
      searchClass = 'max-w-[50%] max-h-[350px]';
      break;
    case 'place_an_order':
      searchClass = 'max-w-[80%] max-h-[350px]';
      break;
    default:
      searchClass =
        'max-h-[calc(100vh_-_350px)] md:max-h-[calc(100vh_-_500px)]';
  }

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
              className={`!pl-6 border-none w-full text-base ${
                searchVariant === 'compare'
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
          className={`${
            searchVariant === 'mobile' ? 'top-[65px]' : 'top-[calc(100%_+_4px)]'
          } bg-white absolute left-0 w-full z-50 py-4 px-6 space-y-4 overflow-y-auto shadow-lg ${searchClass}`}
        >
          {fetcher.state === 'loading' ? (
            <p className="text-base font-bold text-center text-grey-400">
              Loading...
            </p>
          ) : searchResults?.results?.items?.length > 0 ? (
            <SearchResultsProductsGrid
              handleClose={handleClose}
              products={searchResults?.results?.items}
              searchVariant={searchVariant}
            />
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
  const [quantity, setQuantity] = useState(parseFloat(product.moq) || 1);

  const submit = useSubmit();

  switch (searchVariant) {
    case 'mobile':
    case 'normal': {
      return (
        <PredictiveSearchMain product={product} handleClose={handleClose} />
      );
    }
    case 'cart': {
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 md:flex-row"
        >
          <div className="flex flex-wrap items-center w-full gap-3 md:w-4/6">
            <PredictiveProductDetail
              product={product}
              handleClose={handleClose}
            />
          </div>
          {product?.price ? (
            <div className="w-full md:w-[calc(33.33%_-_1rem)]">
              <div className="flex cart__list--quantity">
                <PredictiveSearchQtyBtn
                  moq={product.moq}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>
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
                    className={`w-full mt-2 ${
                      quantity < 1 ||
                      quantity > CART_QUANTITY_MAX ||
                      isNaN(quantity)
                        ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                        : 'cursor-pointer'
                    }`}
                    disabled={
                      quantity < 1 ||
                      quantity > CART_QUANTITY_MAX ||
                      isNaN(quantity)
                    }
                    type={
                      quantity < 1 ||
                      quantity > CART_QUANTITY_MAX ||
                      isNaN(quantity)
                        ? 'button'
                        : 'submit'
                    }
                    variant="primary"
                  >
                    Add to Cart
                  </Button>
                  <PredictiveSearchFormError
                    quantity={quantity}
                    moq={product.moq}
                  />
                </Form>
              </Can>
            </div>
          ) : null}
        </div>
      );
    }
    case 'pending_order': {
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 md:flex-row"
        >
          <div className="flex flex-wrap items-center gap-3 md:w-4/6">
            <PredictiveProductDetail
              product={product}
              handleClose={handleClose}
            />
          </div>
          {product?.price ? (
            <div className="md:w-[calc(33.33%_-_1rem)]">
              <div className="flex cart__list--quantity">
                <PredictiveSearchQtyBtn
                  moq={product.moq}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
              </div>
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
                  className={`w-full mt-2 ${
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                      ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                      : 'cursor-pointer'
                  }`}
                  disabled={
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                  }
                  type={
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                      ? 'button'
                      : 'submit'
                  }
                  variant="primary"
                  name="_action"
                  value="add_product"
                >
                  Add to List
                </Button>
                <PredictiveSearchFormError
                  quantity={quantity}
                  moq={product.moq}
                />
              </Form>
            </div>
          ) : null}
        </div>
      );
    }
    case 'compare': {
      return (
        <PredictiveSearchMain
          product={product}
          handleClose={handleClose}
          isCompare={true}
        />
      );
    }
    case 'place_an_order': {
      const [UOM, setUOM] = useState(product.uom);
      function handleUOM(selectedUOM: string) {
        setUOM(selectedUOM);
      }
      return (
        <div
          key={product.id}
          className="flex flex-col items-center justify-between gap-4 pb-4 border-b last:border-0 xl:flex-row"
        >
          <div className="flex flex-wrap items-center w-full gap-3 xl:w-2/5">
            <PredictiveProductDetail
              product={product}
              handleClose={handleClose}
            />
          </div>
          {product?.price ? (
            <div className="grid grid-cols-1 gap-x-4 w-full gap-y-2 sm:grid-cols-2 xl:w-[calc(60%_-_1rem)] items-start">
              <div className="flex h-full">
                <p className="mt-auto font-medium">Unit of Measure</p>
              </div>
              <div className="flex cart__list--quantity">
                <PredictiveSearchQtyBtn
                  moq={product.moq}
                  quantity={quantity}
                  setQuantity={setQuantity}
                />
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
                    (uom: {unit: string; code: string}, index: number) => (
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
                  className={`w-full ${
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                      ? 'cursor-not-allowed text-grey-400 !bg-grey-200'
                      : 'cursor-pointer'
                  }`}
                  disabled={
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                  }
                  type={
                    quantity < 1 ||
                    quantity > CART_QUANTITY_MAX ||
                    isNaN(quantity)
                      ? 'button'
                      : 'submit'
                  }
                  variant="primary"
                  name="_action"
                  value="add_product"
                >
                  Add to List
                </Button>
                <PredictiveSearchFormError
                  quantity={quantity}
                  moq={product.moq}
                />
              </Form>
            </div>
          ) : null}
        </div>
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
        <Link
          to={Routes.CATEGORIES}
          onClick={handleClose}
          className="flex items-center justify-center px-6 py-2 text-sm font-bold leading-6 uppercase duration-150 border-solid cursor-pointer bg-secondary-500 hover:bg-secondary-500 text-grey-900"
        >
          View all
        </Link>
      </div>
    </>
  );
}
