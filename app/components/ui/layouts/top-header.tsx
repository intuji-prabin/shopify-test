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
import {Search} from 'lucide-react';
import SearchIcon from '~/components/icons/search';
import CloseMenu from '~/components/icons/closeMenu';

export function PlaceOrder() {
  return (
    <Button className="place-order h-full bg-secondary-500  px-6 hover:bg-secondary-500 min-h-12">
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
    <div className="flex items-center gap-4 border border-l-2 border-t-0 border-b-0 border-grey-800 pl-4 ">
      <TrackAnOrderButton />
      <PlaceOrder />
    </div>
  );
}
export function LogoIcon({logo_url}: {logo_url: string}) {
  return (
    <Link to={Routes.HOME}>
      <figure>
        <img src={logo_url} alt="My cigweld logo" />
      </figure>
    </Link>
  );
}
export function NotificationNavbar() {
  const navIcons = [
    {
      id: 1,
      icon: <CartIcon width={'20px'} height={'20px'} />,
      url: Routes.CART_LIST,
      title: 'cart',
      notification: '3',
    },
    {
      id: 2,
      icon: <Note width={'20px'} height={'20px'} />,
      url: '/note',
      title: 'Pending Order',
      notification: '3',
    },
    {
      id: 3,
      icon: <Heart width={'20px'} height={'20px'} />,
      url: Routes.WISHLIST,
      title: 'Wishlist',
      notification: '3',
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
      <ul className="nav-list flex gap-4 items-center h-full">
        {navIcons.map((navIcon) => (
          <li className="nav-item relative" key={navIcon.id}>
            <Link to={navIcon.url} className="info-block">
              {' '}
              <div data-tooltip={navIcon.title}>
                <div className="absolute bg-semantic-danger-500 h-[14px] w-[14px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium p-2">
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

export default function TopHeader() {
  const [isClicked, setIsClicked] = useState(false);
  const [searchProduct, setSearchProduct] = useState(false);

  function handleSearchInput() {
    setSearchProduct(true);
  }

  function handleCloseSearch() {
    setSearchProduct(false);
  }
  return (
    <>
      <div className="bg-grey-900">
        <div className="container py-5 flex  gap-3 justify-between ">
          {/* home logo begins here */}
          <LogoIcon logo_url={'/Logo.png'} />
          {/* Search and notification bar begins here  */}
          <div className="flex gap-[22px]">
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

              {searchProduct && (
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
                  <div className="pt-4 border-grey-50 border-t">
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
                </div>
              )}
            </div>

            {/* notification menu starts here */}
            <NotificationNavbar />
          </div>

          {/* order track begins here  */}
          <OrderTrack />

          {/* user profile begins here  */}
          <div className="flex items-center gap-1">
            <figure className="rounded-[50%]">
              <img src="/niel.png" alt="" />
            </figure>
            <DropdownMenu open={isClicked} onOpenChange={setIsClicked}>
              <DropdownMenuTrigger asChild>
                <Button className="bg-transparent italic font-bold text-base hover:bg-transparent border-none focus:border-transparent focus-visible:border-transparent outline-none focus:outline-none p-0">
                  Niel De Grass
                  {isClicked ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 user-login max-w-[172px] rounded-none mr-4">
                <DropdownMenuLabel className="flex items-center user-login-dropdown p-0 ">
                  <Form method="post" action="/logout" className="w-full">
                    <Button
                      type="submit"
                      className="bg-white  w-full items-center justify-start hover:bg-primary-100 px-2 "
                    >
                      <UserProfile />
                      <h5 className="text-lg font-bold italic text-grey-900">
                        My profile
                      </h5>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-white px-2 w-full items-center justify-start hover:bg-primary-100 "
                    >
                      <Logout />
                      <h5 className="text-lg font-bold italic text-grey-900">
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
    </>
  );
}
