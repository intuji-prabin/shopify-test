import {FaSearch} from 'react-icons/fa';
import {Form, Link} from '@remix-run/react';
import {Heart, Logout, UserProfile} from '~/components/icons/orderStatus';
import {useState} from 'react';
import {Button} from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from '~/components/ui/dropdown-menu';
import {IoIosArrowDown, IoIosArrowUp} from 'react-icons/io';
import {Routes} from '~/lib/constants/routes.constent';
import {CartIcon} from '~/components/icons/cartIcon';
import {TrackAnOrderButton} from './elements/track-an-order-dialog';
import {Note} from '~/components/icons/note';
import {NotificationIcon} from '~/components/icons/notification';
import {CustomerData} from '~/routes/_public.login/login.server';
import TabletNavmenu from './tablet-navbar/tablet-navmenu';
import {useHamburgerMenu} from './elements/HamburgerMenuContext';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {PredictiveSearch} from '~/components/ui/predictive-search';

export function PlaceOrder() {
  const {isOpen, toggleMenu} = useHamburgerMenu();

  return (
    <Link to={Routes.PLACE_AN_ORDER} prefetch="intent">
      <Button
        className="h-full px-6 place-order bg-secondary-500 hover:bg-secondary-500 min-h-12 text-grey-900"
        onClick={() => toggleMenu(!isOpen)}
      >
        Place an order
      </Button>
    </Link>
  );
}
export function OrderTrack() {
  return (
    <div className="items-center hidden gap-4 pl-4 border border-t-0 border-b-0 border-l-2 xl:flex border-grey-800 ">
      <TrackAnOrderButton />
      <PlaceOrder />
    </div>
  );
}
export function LogoIcon({logo_url}: {logo_url: string}) {
  return (
    <Link to={Routes.HOME}>
      <figure className="w-40 ">
        <img src={logo_url} alt="My cigweld logo" />
      </figure>
    </Link>
  );
}

export function NotificationNavbar({
  cartCount,
  wishlistCount,
  pendingOrderCount,
  notificationCount,
}: {
  cartCount: number;
  wishlistCount: number;
  pendingOrderCount: number;
  notificationCount: number;
}) {
  const {isOpen, toggleMenu} = useHamburgerMenu();

  const navIcons = [
    {
      id: 1,
      icon: <CartIcon width={'20px'} height={'20px'} />,
      url: Routes.CART_LIST,
      title: 'cart',
      notification: cartCount,
    },
    {
      id: 2,
      icon: <Note width={'20px'} height={'20px'} />,
      url: Routes.PENDING_ORDER,
      title: 'Pending Order',
      notification: pendingOrderCount,
    },
    {
      id: 3,
      icon: <Heart width={'20px'} height={'20px'} />,
      url: Routes.WISHLIST,
      title: 'Wishlist',
      notification: wishlistCount,
    },
    {
      id: 4,
      icon: <NotificationIcon width={'20px'} height={'20px'} />,
      url: Routes.NOTIFICATIONS_NEW,
      title: 'Notifications',
      notification: notificationCount,
    },
  ];
  return (
    <div className="navbar">
      <ul className="flex items-center h-full gap-5 nav-list">
        {navIcons.map((navIcon) => (
          <li className="relative nav-item" key={navIcon.id}>
            <Link
              to={navIcon.url}
              className="info-block"
              onClick={() => toggleMenu(!isOpen)}
            >
              {' '}
              <div data-tooltip={navIcon.title}>
                <div className="absolute bg-semantic-danger-500 h-[14px] min-w-[16px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium py-2 px-1">
                  {navIcon.notification}
                </div>
                <div className="nav-link">{navIcon.icon}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TopHeader({
  userDetails,
  cartCount,
  wishlistCount,
  pendingOrderCount,
  notificationCount,
}: {
  userDetails: CustomerData;
  cartCount: number;
  wishlistCount: number;
  pendingOrderCount: number;
  notificationCount: number;
}) {
  const [isClicked, setIsClicked] = useState(false);

  const imageUrl = userDetails.meta?.image_url?.value
    ? userDetails.meta.image_url.value
    : DEFAULT_IMAGE.DEFAULT;

  return (
    <div className="bg-grey-900">
      <div className="container flex items-center gap-3 py-5 justify-normal xl:justify-between">
        <div className="flex items-center gap-4">
          <TabletNavmenu />
          {/* home logo begins here */}
          <LogoIcon logo_url={'/myCigweldWhite.svg'} />
        </div>
        {/* Search and notification bar begins here  */}
        <div className="flex gap-[22px] w-full xl:w-[unset]">
          {/* search bar begins here */}
          <div className="search-bar flex bg-white items-center min-w-[unset] w-full max-h-12 px-4 py-3 xl:min-w-[453px] relative">
            <PredictiveSearch searchVariant="normal" />
          </div>

          {/* notification menu starts here */}
          <NotificationNavbar
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            pendingOrderCount={pendingOrderCount}
            notificationCount={notificationCount}
          />
        </div>

        {/* order track begins here  */}
        <OrderTrack />

        {/* user profile begins here  */}
        <div className="items-center hidden gap-1 xl:flex">
          <figure className="w-8 h-8">
            <img
              src={imageUrl ?? '/niel.png'}
              alt="profile-image"
              className="object-cover object-center w-full h-full rounded-full"
            />
          </figure>
          <DropdownMenu open={isClicked} onOpenChange={setIsClicked}>
            <DropdownMenuTrigger asChild>
              <Button className="p-0 text-base italic font-bold capitalize bg-transparent border-none outline-none hover:bg-transparent focus:border-transparent focus-visible:border-transparent focus:outline-none">
                {userDetails?.firstName}
                {isClicked ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 user-login max-w-[172px] rounded-none mr-4">
              <DropdownMenuLabel className="flex items-center p-0 user-login-dropdown ">
                <Form method="post" action="/logout" className="w-full">
                  <Link
                    onClick={() => setIsClicked(false)}
                    to={Routes.PROFILE}
                    className="flex items-center justify-start w-full gap-2 p-2 transition duration-500 ease-in-out delay-75 bg-white hover:bg-primary-100 my-profile"
                  >
                    <UserProfile />
                    <h5 className="text-lg italic font-bold text-grey-900">
                      My profile
                    </h5>
                  </Link>
                  <Button
                    type="submit"
                    className="items-center justify-start w-full px-2 transition duration-500 ease-in-out delay-75 bg-white hover:bg-primary-100"
                  >
                    <Logout />
                    <h5 className="text-lg italic font-bold text-grey-900">
                      Logout
                    </h5>
                  </Button>
                </Form>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
