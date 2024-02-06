import {Link} from '@remix-run/react';

import {useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import {TooltipInfo} from '~/components/icons/orderStatus';
import SearchIcon from '~/components/icons/search';
import {Button} from '~/components/ui/button';
type ProductImage = {
  imageUrl: string;
  isFavourited: boolean;
};
type ProductCardInfoProps = {
  productName: string;
  buyPrice: number;
  rppPrice: number;
};
export type CompareproductProps = ProductImage & ProductCardInfoProps;
export default function CompareProductSearch({
  imageUrl,
  productName,
  buyPrice,
  rppPrice,
}: CompareproductProps) {
  const [searchProduct, setSearchProduct] = useState(false);

  const handleSearchResults = () => {
    setSearchProduct(!searchProduct);
  };
  const handleCloseItem = () => {
    setSearchProduct(!searchProduct);
  };

  return (
    <>
      <div>
        <div
          className={`relative px-11 py-[39px] border-grey-25 border-b-2 border-x-0 border-top-0 bg-grey-25 h-[261px]
          }`}
        >
          {searchProduct ? (
            <figure className="flex justify-center items-center">
              {' '}
              <img src={imageUrl} className="" alt="product-image" />
              <Button
                className="absolute top-2 right-2 bg-white max-h-8 max-w-8 p-2 hover:bg-white"
                onClick={handleCloseItem}
              >
                <CloseMenu fillColor="#0F1010" />
              </Button>
            </figure>
          ) : undefined}
        </div>
        {searchProduct ? (
          <div className="p-4 flex flex-col gap-6 ">
            <div className="tag flex flex-col gap-[11px]">
              <div>
                <h5 className="text-lg italic font-bold leading-6 text-grey-900 line-clamp-2 text-ellipsis whitespace-normal h-12">
                  {productName}
                </h5>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <p className="text-semantic-success-500 text-base font-bold uppercase leading-[21px]">
                      BUY PRICE
                    </p>
                    <div className="info-block">
                      <p className="h-5 w-5 flex justify-center items-center ">
                        <Link to="" data-tooltip="Recommended retail price">
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-[30px] font-bold text-[#252727]">
                    ${buyPrice.toFixed(2)}
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (Excl. GST)
                  </p>
                </div>
                <div className="flex flex-col border-grey-50 border-l-2 border-y-0 border-r-0 pl-6">
                  <div className="flex items-center ">
                    <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                      rrp
                    </p>
                    <div className="info-block">
                      <p className="h-5 w-5 flex justify-center items-center ">
                        <Link
                          to=""
                          data-tooltip="Buy Price is your account specific price, including all contracted prices or discounts"
                        >
                          <span>
                            <TooltipInfo />
                          </span>
                        </Link>
                      </p>
                    </div>
                  </div>
                  <h3 className="italic leading-[36px] text-[30px] font-bold text-grey-300">
                    ${rppPrice.toFixed(2)}
                  </h3>
                  <p className="text-[14px] font-normal leading-4">
                    (inc. GST)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="product-add">
            <p className="text-lg leading-[22px] text-grey-900 font-medium my-4">
              Add a product
            </p>
            <div className="flex bg-white border-grey-300 border items-center px-3">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search product"
                onChange={handleSearchResults}
                className="w-full outline-none border-none focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
