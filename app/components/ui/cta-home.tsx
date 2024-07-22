import {Link} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {Can} from '~/lib/helpers/Can';
import ArrowRight from '../icons/arrowRight';
import Bell from '../icons/bell';
import Receipt from '../icons/receipt';
import {TrackAnOrderButton} from './layouts/elements/track-an-order-dialog';
import {Separator} from './separator';
type PropType = {
  totalNotificationCount: number;
  cartCount: number;
};

const CtaHome: React.FC<PropType> = ({ totalNotificationCount, cartCount }) => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-3 lg:gap-x-6 place-content-center">
        <Link
          to={Routes.CART_LIST}
          className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-secondary-500 lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center"
        >
          <span className="flex items-center gap-1">
            <div className="relative">
              {/* Notification Badge */}
              <div className="absolute bg-semantic-danger-500 h-[20px] min-w-[20px] rounded-full -right-1 -top-1 flex items-center justify-center text-sm text-white font-medium">
                {cartCount}
              </div>
              <Receipt />
            </div>
            Place An Order
          </span>
          <span className="arrow__animation">
            <ArrowRight />
          </span>
        </Link>
        <Can I="view" a="track_order">
          <TrackAnOrderButton trackAnOrderHome={true} />
        </Can>
        <Link
          to={Routes.NOTIFICATIONS_NEW}
          className="cta__btn pr-6 pl-4 py-4 lg:py-6 lg:pl-6 lg:pr-8 text-lg italic font-bold capitalize bg-primary-500 text-white lg:text-xl xl:text-2xl min-h-[88px] flex justify-between items-center"
        >
          <span className="relative flex items-center gap-1">
            <div className="relative">
              {/* Notification Badge */}
              <div className="absolute bg-semantic-danger-500 h-[20px] min-w-[20px] rounded-full right-1 -top-1 flex items-center justify-center text-sm text-white font-medium">
                {totalNotificationCount}
              </div>
              <Bell />
            </div>
            Notifications
          </span>

          <span className="arrow__animation">
            <ArrowRight fillColor="#ffffff" />
          </span>
        </Link>
      </div>
      <Separator className="mt-6" />
    </section>
  );
};

export default CtaHome;
