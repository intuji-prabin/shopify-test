import { FaSearch } from 'react-icons/fa';
import { Form, Link } from '@remix-run/react';
import {
  Heart,
  Logout,
  TabletHamburger,
  UserProfile,
} from '~/components/icons/orderStatus';
import { SetStateAction, useRef, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
} from '~/components/ui/dropdown-menu';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Routes } from '~/lib/constants/routes.constent';
import { CartIcon } from '~/components/icons/cartIcon';
import { TrackAnOrderButton } from './elements/track-an-order-dialog';
import { Note } from '~/components/icons/note';
import { NotificationIcon } from '~/components/icons/notification';
import SearchIcon from '~/components/icons/search';
import CloseMenu from '~/components/icons/closeMenu';
import { CustomerData } from '~/routes/_public.login/login.server';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import TabletNavmenu from './tablet-navbar/tablet-navmenu';
import { useHamburgerMenu } from './elements/HamburgerMenuContext';

export function PlaceOrder() {
  const { isOpen, toggleMenu } = useHamburgerMenu();

  return (
    <Button
      className="h-full px-6 place-order bg-secondary-500 hover:bg-secondary-500 min-h-12"
      onClick={() => toggleMenu(!isOpen)}
    >
      <Link
        to={Routes.PLACE_AN_ORDER}
        className="uppercase  text-[14px] italic font-bold flex items-center text-grey-900 h-full"
      >
        Place an order
      </Link>
    </Button>
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
export function LogoIcon({ logo_url }: { logo_url: string }) {
  return (
    <Link to={Routes.HOME}>
      <figure>
        <img src={logo_url} alt="My cigweld logo" />
      </figure>
    </Link>
  );
}

export function NotificationNavbar({ cartCount, wishlistCount }: { cartCount: number, wishlistCount: number }) {
  const { isOpen, toggleMenu } = useHamburgerMenu();

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
      notification: '3',
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
      url: Routes.NOTIFICATION,
      title: 'Notifications',
      notification: '3',
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

export default function TopHeader({ userDetails, cartCount, wishlistCount }: { userDetails: CustomerData, cartCount: number, wishlistCount: number }) {
  const [isClicked, setIsClicked] = useState(false);
  const [searchProduct, setSearchProduct] = useState(false);
  const searchResultRef = useRef<HTMLDivElement>(null);
  useOutsideClick(searchResultRef, () => setSearchProduct(false));

  function handleSearchInput() {
    setSearchProduct(true);
  }

  function handleCloseSearch() {
    setSearchProduct(false);
  }

  const fullName = `${userDetails.firstName} ${userDetails.lastName}`;

  const imageUrl = userDetails.meta?.image_url?.value;

  return (
    <div className="bg-grey-900">
      <div className="container flex items-center gap-3 py-5 justify-normal xl:justify-between">
        <div className="flex items-center gap-4">
          <TabletNavmenu
            setIsHamOpen={function (value: SetStateAction<boolean>): void {
              throw new Error('Function not implemented.');
            }}
          />
          {/* home logo begins here */}
          <LogoIcon logo_url={'/Logo.png'} />
        </div>
        {/* Search and notification bar begins here  */}
        <div className="flex gap-[22px] w-full xl:w-[unset]">
          {/* search bar begins here */}
          <div className="search-bar flex bg-white items-center min-w-[unset] w-full max-h-12 px-4 py-3 xl:min-w-[453px] relative">
            <FaSearch className="search-icon fill-primary-500" />
            <input
              type="text"
              placeholder="Search Product or Part Number"
              className="border-none w-full placeholder:italic text-base font-bold text-[#0F1010] placeholder:text-[#0F1010] focus:bg-white"
              onChange={handleSearchInput}
            />
            {searchProduct && (
              <Button
                className="p-0 bg-white hover:bg-white active:bg-white"
                onClick={handleCloseSearch}
              >
                {' '}
                <CloseMenu fillColor="#D92F28" />
              </Button>
            )}

            {/* searchbar starts here  */}
            {searchProduct && (
              <div ref={searchResultRef}>
                <div className="bg-white absolute top-[52px] left-0 w-full z-20 py-4 px-6 space-y-4">
                  <div>
                    <p className="mb-2 font-medium text-grey-900">
                      Suggestions
                    </p>
                    <ul>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        Welding Equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        Welding Equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        Welding Equipment
                      </li>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        welders
                      </li>
                    </ul>
                  </div>
                  <div className="py-4 border-t border-grey-50">
                    <p className="mb-2 font-medium text-grey-900">
                      Recent Searches
                    </p>
                    <ul>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        Welding & Heating Mixers
                      </li>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        cutting attachments
                      </li>
                      <li className="flex items-center gap-2">
                        <SearchIcon fillColor="#0F1010" />
                        tig welding
                      </li>
                    </ul>
                  </div>
                  <Link
                    to=""
                    className="text-sm italic font-bold uppercase border-b text-primary-500 border-primary-500"
                  >
                    CLEAR ALL RECENT
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* notification menu starts here */}
          <NotificationNavbar cartCount={cartCount} wishlistCount={wishlistCount} />
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
                {fullName}
                {isClicked ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 user-login max-w-[172px] rounded-none mr-4">
              <DropdownMenuLabel className="flex items-center p-0 user-login-dropdown ">
                <Form method="post" action="/logout" className="w-full">
                  <Link
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
