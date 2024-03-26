import { Link } from '@remix-run/react';
import ComparisonItems from './comparison-items';
import ComparisonProperties from './comparison-properties';
import { TooltipInfo } from '~/components/icons/orderStatus';

export default function ComparisonWrapper(productResponse: any) {
  console.log("productResponse", productResponse.productResponse);
  const finalResponse = productResponse?.productResponse;
  return (
    <div className="mt-6 overflow-x-auto bg-white">
      <div className='flex gap-6 p-6'>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          <figure className='flex items-center justify-center h-48 p-5 bg-grey-25'>
            <img src="/product.png" alt="product1" className='object-contain h-full overflow-hidden' />
          </figure>
          <div className='pt-3'>
            <p className='text-lg font-medium leading-[22px] text-grey-900'>
              <Link to="#">
                ProLite Auto-Darkening Welding Helmet – Terra – 100 Years Of
              </Link>
            </p>
          </div>
          <div className="flex gap-2 pb-6 mt-2 mb-6 border-b border-solid md:gap-6 border-grey-25">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-semantic-success-500 text-sm md:text-base font-bold uppercase leading-[21px]">
                  BUY PRICE
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
                    <Link to="" data-tooltip="Recommended retail price">
                      <span>
                        <TooltipInfo />
                      </span>
                    </Link>
                  </p>
                </div>
              </div>
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                $1234
              </h3>
              <p className="text-[14px] font-normal leading-4">
                (Excl. GST)
              </p>
            </div>
            <div className="flex flex-col pl-1 md:pl-6">
              <div className="flex items-center ">
                <p className="text-grey-300 not-italic text-base font-bold uppercase leading-[21px]">
                  rrp
                </p>
                <div className="info-block">
                  <p className="flex items-center justify-center w-5 h-5 ">
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
              <h3 className="italic leading-[36px] text-lg md:text-[30px] font-bold text-[#252727]">
                $1234
              </h3>
              <p className="text-[14px] font-normal leading-4">
                (inc. GST)
              </p>
            </div>
          </div>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Filter Lens Dimensions</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">120 x 100 x 18 mm</p>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">On/Off Control</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">Automatic</p>
          <p className="px-6 py-3 text-lg font-semibold leading-6 text-grey-900 bg-primary-50">Operating Temperature</p>
          <p className="px-6 py-3 text-lg font-medium leading-6 text-grey-900">-5C to 55C</p>
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, illo fugiat unde culpa ab eaque error dolor ex vero doloremque placeat minus perferendis nemo libero assumenda, distinctio quia corporis qui totam cumque consectetur nam omnis? Repellat facilis accusantium quaerat repellendus temporibus dolorum autem itaque minus quibusdam, quam et impedit, a veritatis. Voluptates, earum unde ipsam cupiditate molestiae enim dolorum maiores accusamus, dicta sequi facilis placeat exercitationem at laboriosam neque distinctio soluta? Tempora exercitationem amet beatae sit voluptate nemo sapiente assumenda, incidunt autem cupiditate iure fugiat iusto deserunt accusantium pariatur rerum distinctio quod provident possimus hic nostrum. Odit alias obcaecati iure?
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, illo fugiat unde culpa ab eaque error dolor ex vero doloremque placeat minus perferendis nemo libero assumenda, distinctio quia corporis qui totam cumque consectetur nam omnis? Repellat facilis accusantium quaerat repellendus temporibus dolorum autem itaque minus quibusdam, quam et impedit, a veritatis. Voluptates, earum unde ipsam cupiditate molestiae enim dolorum maiores accusamus, dicta sequi facilis placeat exercitationem at laboriosam neque distinctio soluta? Tempora exercitationem amet beatae sit voluptate nemo sapiente assumenda, incidunt autem cupiditate iure fugiat iusto deserunt accusantium pariatur rerum distinctio quod provident possimus hic nostrum. Odit alias obcaecati iure?
        </div>
        <div className='min-w-[290px] w-full max-w-[290px]'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatibus, illo fugiat unde culpa ab eaque error dolor ex vero doloremque placeat minus perferendis nemo libero assumenda, distinctio quia corporis qui totam cumque consectetur nam omnis? Repellat facilis accusantium quaerat repellendus temporibus dolorum autem itaque minus quibusdam, quam et impedit, a veritatis. Voluptates, earum unde ipsam cupiditate molestiae enim dolorum maiores accusamus, dicta sequi facilis placeat exercitationem at laboriosam neque distinctio soluta? Tempora exercitationem amet beatae sit voluptate nemo sapiente assumenda, incidunt autem cupiditate iure fugiat iusto deserunt accusantium pariatur rerum distinctio quod provident possimus hic nostrum. Odit alias obcaecati iure?
        </div>
      </div>
    </div >
  );
}
