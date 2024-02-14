import {Link} from '@remix-run/react';

export default function OrderTopDetail() {
  return (
    <>
      <div className="top-card flex justify-between items-center pb-4  border-gray-100 border-x-0 border-b-2 border-t-0">
        <div className="flex justify-between items-center gap-4 ">
          <h4 className="text-2xl italic font-bold leading-[29px]">
            Order No 0005145629{' '}
          </h4>
          <button className="px-[6px] py-2 border text-[14px] font-bold leading-4">
            Processing
          </button>
        </div>
        <div>
          <Link
            to=""
            className=" text-gray-900  border-primary-500 border-b-2 border-x-0 border-t-0 p-2 italic font-bold text-[14px] leading-6 uppercase"
          >
            VIEW INVOICES
          </Link>
        </div>
      </div>
    </>
  );
}
