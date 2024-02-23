import {Link} from '@remix-run/react';
import {Button} from '~/components/ui/button';

export default function OrderTopDetail({order_no}: {order_no: string}) {
  return (
    <>
      <div className="top-card flex justify-between items-center pb-4  border-gray-100 border-x-0 border-b-2 border-t-0">
        <div className="flex justify-between items-center gap-4 ">
          <h4 className="text-2xl italic font-bold leading-[29px]">
            Order No <span>{order_no} </span>{' '}
          </h4>
          <Button variant="status_brown">Processing</Button>
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
