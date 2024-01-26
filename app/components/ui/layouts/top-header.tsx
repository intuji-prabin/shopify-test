import {FaSearch} from 'react-icons/fa';
import {Form, Link} from '@remix-run/react';
import {
  Heart,
  Notification,
  Ordertrack,
  Logout,
  UserProfile,
} from '~/components/icons/orderStatus';
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

export default function TopHeader() {
  const [isClicked, setIsClicked] = useState(false);
  const navIcons = [
    {
      id: 1,
      icon: <CartIcon width={'20px'} height={'20px'} />,
      url: '/cart',
      title: 'cart',
      notification: '3',
    },
    {
      id: 2,
      icon: <Note width={'20px'} height={'20px'} />,
      url: '/note',
      title: 'Note',
      notification: '3',
    },
    {
      id: 3,
      icon: <Heart width={'20px'} height={'20px'} />,
      url: '/heart',
      title: 'Heart',
      notification: '3',
    },
    {
      id: 4,
      icon: <NotificationIcon width={'20px'} height={'20px'} />,
      url: '/notification',
      title: 'Notification',
      notification: '3',
    },
  ];

  return (
    <>
      <header className="bg-grey-900">
        <div className="container py-5 flex  gap-3 justify-between ">
          {/* home icon begins here */}
          <Link to={Routes.HOME}>
            <figure>
              <img src="Logo.png" alt="My cigweld logo" />
            </figure>
          </Link>
          {/* Search and notification bar begins here  */}
          <div className="flex gap-[22px]">
            <div className="search-bar flex bg-white items-center min-w-[unset] w-full max-h-12 px-4 py-3 xl:min-w-[453px]">
              <FaSearch className="search-icon fill-primary-500" />
              <input
                type="text"
                placeholder="Search Product or Part Number"
                className="border-none w-full placeholder:italic text-base font-bold text-[#0F1010] placeholder:text-[#0F1010]"
              />
            </div>
            <nav className="navbar">
              <ul className="nav-list flex gap-4 items-center h-full">
                {navIcons.map((navIcon) => (
                  <li className="nav-item relative" key={navIcon.id}>
                    <div className="info-block">
                      {' '}
                      <Link to={navIcon.url} data-tooltip={navIcon.title}>
                        <div className="absolute bg-semantic-danger-500 h-[14px] w-[14px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium p-2">
                          {navIcon.notification}
                        </div>
                        <Link to="" className="nav-link">
                          {navIcon.icon}
                        </Link>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* order track begins here  */}
          <div className="flex items-center gap-4 border border-l-2 border-t-0 border-b-0 border-grey-800 pl-4 ">
            <TrackAnOrderButton />

            <div className="place-order h-full ">
              <Link
                to={Routes.PLACE_AN_ORDER}
                className="uppercase  text-[14px] italic font-bold bg-secondary-500 h-full px-6 flex items-center"
              >
                Place an order
              </Link>
            </div>
          </div>

          {/* user profile begins here  */}
          <div className="flex items-center gap-1">
            <figure className="rounded-[50%]">
              <img src="niel.png" alt="" />
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
      </header>
    </>
  );
}
