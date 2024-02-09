import {useRef, useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import HamburgerIcon from '~/components/icons/hamburgerIcon';
import {Signout} from '~/components/icons/signout';
import {Button} from '../button';
import SearchIcon from '~/components/icons/search';
import {Link} from '@remix-run/react';
import {TrackAnOrderButton} from './elements/track-an-order-dialog';
import {LogoIcon, NotificationNavbar, PlaceOrder} from './top-header';
import {mobileMenuItemsData} from './elements/bottom-header-menu-items';

export default function MobileNav() {
  const [isHamOpen, setIsHamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);

  return (
    <>
      <div className="bg-grey-900 px-4 py-6 flex justify-between items-center relative">
        <LogoIcon logo_url={'Logo.png'} />
        <div className="flex gap-2 items-center">
          <Button
            className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
            }}
          >
            {' '}
            <SearchIcon fillColor="#FFE600" width={''} height={''} />
          </Button>

          <Button
            className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
            onClick={() => {
              setIsHamOpen(!isHamOpen);
            }}
          >
            {isHamOpen ? <CloseMenu /> : <HamburgerIcon />}
          </Button>
        </div>
      </div>

      <div
        className={`bg-primary-500 p-4 flex flex-col gap-16 transition-opacity ease-in-out delay-75 duration-150 mobile-nav
        ${isHamOpen ? 'block' : 'hidden'}  `}
      >
        <div className="user-menu flex gap-4 flex-col">
          <div className="flex justify-between flex-col-reverse gap-4">
            {' '}
            {/* user profile starts here */}
            <div className="flex gap-2 ">
              <figure>
                <img src="niel.png" alt="" />
              </figure>
              <div className="flex justify-between w-full items-center">
                <p className="text-lg font-normal text-white">Niel De Grass</p>
                <Link
                  to=""
                  className="font-bold text-lg leading-6 italic text-white border-b border-white border-x-0 border-t-0 uppercase"
                >
                  my profile
                </Link>
              </div>
            </div>
            {/* notification menu bar starts */}
            <NotificationNavbar />
          </div>
          {/* menu navigation starts here */}
          <ul className="flex flex-col gap-4">
            {mobileMenuItemsData.map((navigation) => (
              <li
                key={navigation.title}
                className="italic uppercase font-bold text-base text-white hover:text-secondary-500  active:text-secondary-500"
              >
                <Link to={navigation.url} className="w-full block">
                  {navigation.title}
                </Link>
              </li>
            ))}
          </ul>

          {/* <MainNavigationMenus categories={[]} /> */}
          {/*  order track starts here */}
          <div className="flex items-center gap-4 flex-row-reverse justify-end ">
            <TrackAnOrderButton />
            <PlaceOrder />
          </div>
          {/* order track ends here */}
        </div>

        {/* user logout starts here */}
        <Button className="flex gap-[2px] justify-start p-0 hover:bg-transparent">
          <Signout />
          <p className="italic uppercase font-bold text-base text-white">
            Log out
          </p>
        </Button>
      </div>

      {/* search bar starts here  */}
      {isSearchOpen ? (
        <div className="bg-grey-900 p-4 absolute top-0 w-full">
          <div className="flex bg-grey-900 border-primary-400 border-2 items-center p-2 ">
            <SearchIcon width={'24px'} height={'24px'} fillColor="#fff" />
            <input
              type="text"
              placeholder="Search product or part number"
              className="w-full outline-none border-none focus:bg-transparent bg-transparent placeholder:text-white text-white"
            />
            <Button
              className="bg-semantic-danger-500 p-2"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              <CloseMenu fillColor="#fff" />
            </Button>
          </div>
        </div>
      ) : undefined}
    </>
  );
}
