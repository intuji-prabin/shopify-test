import {useRef, useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import HamburgerIcon from '~/components/icons/hamburgerIcon';
import {Button} from '../../../button';
import SearchIcon from '~/components/icons/search';
import {LogoIcon, NotificationNavbar} from '../../top-header';
import {useOutsideClick} from '~/hooks/useOutsideClick';
import UserProfle from './user-profle';
import NavMenu from './nav-menu';
import OrderTrackMobile from './order-track';
import LogoutForm from './logout-form';

export default function MobileNav() {
  const [isHamOpen, setIsHamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const mobileNavSectionRef = useRef<HTMLDivElement>(null);
  useOutsideClick(mobileNavSectionRef, () => setIsHamOpen(false));

  return (
    <>
      <div ref={mobileNavSectionRef}>
        <div className="bg-grey-900 px-4 py-6 flex justify-between items-center relative">
          <LogoIcon logo_url={'/Logo.png'} />
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
          className={`bg-primary-500 p-4 flex flex-col gap-16 transition-opacity ease-in-out delay-75 duration-150 mobile-nav z-[1000] absolute w-full
        ${isHamOpen ? 'block' : 'hidden'}  `}
        >
          <div className="user-menu flex gap-4 flex-col">
            <div className="flex justify-between flex-col-reverse gap-4">
              {' '}
              {/* user profile starts here */}
              <UserProfle user_name={'Niel De Grass'} />
              {/* notification menu bar starts */}
              <NotificationNavbar />
            </div>
            {/* menu navigation starts here */}
            <NavMenu />

            {/*  order track starts here */}
            <OrderTrackMobile />
          </div>

          {/* user logout starts here */}
          <LogoutForm />
        </div>
      </div>

      {/* search bar starts here  */}
      {isSearchOpen ? (
        <div className="bg-grey-900 p-4 absolute top-0 w-full ">
          <div className="flex bg-grey-900 border-primary-400 border-2 items-center p-2 ">
            <SearchIcon width={'24px'} height={'24px'} fillColor="#fff" />
            <input
              type="text"
              placeholder="Search product or part number"
              className="w-full outline-none border-none focus:bg-transparent bg-transparent placeholder:text-white text-white"
            />
            <Button
              className="bg-semantic-danger-500 p-2 hover:bg-semantic-danger-500"
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
