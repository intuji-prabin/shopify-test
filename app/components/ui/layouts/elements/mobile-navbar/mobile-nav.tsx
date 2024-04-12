import { useRef, useState } from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import HamburgerIcon from '~/components/icons/hamburgerIcon';
import SearchIcon from '~/components/icons/search';
import { PredictiveSearch } from '~/components/ui/predictive-search';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { CustomerData } from '~/routes/_public.login/login.server';
import { Button } from '../../../button';
import { LogoIcon, NotificationNavbar } from '../../top-header';
import { useHamburgerMenu } from '../HamburgerMenuContext';
import LogoutForm from './logout-form';
import NavMenu from './nav-menu';
import OrderTrackMobile from './order-track';
import UserProfile from './user-profle';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

export default function MobileNav({
  userDetails,
  cartCount,
  wishlistCount,
  pendingOrderCount,
}: {
  userDetails: CustomerData;
  cartCount: number;
  wishlistCount: number;
  pendingOrderCount: number;
}) {
  // const [isOpen, setisOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isOpen, toggleMenu } = useHamburgerMenu();
  const mobileNavSectionRef = useRef<HTMLDivElement>(null);
  useOutsideClick(mobileNavSectionRef, () => toggleMenu(false));

  const imageUrl = userDetails.meta?.image_url?.value
    ? userDetails.meta.image_url.value
    : DEFAULT_IMAGE.DEFAULT;

  return (
    <>
      <div ref={mobileNavSectionRef}>
        <div className="relative flex items-center justify-between px-4 py-6 bg-grey-900">
          <LogoIcon logo_url={'/myCigweldWhite.svg'} />
          <div className="flex items-center gap-2">
            <Button
              className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
              }}
            >
              {' '}
              <SearchIcon fillColor="#FFE600" width={'24px'} height={'24px'} />
            </Button>

            <Button
              className="border border-[#313535] p-2 bg-transparent max-w-10 max-h-10 hover:bg-transparent"
              onClick={() => {
                toggleMenu(!isOpen);
              }}
            >
              {isOpen ? <CloseMenu /> : <HamburgerIcon />}
            </Button>
          </div>
        </div>

        <div
          className={`bg-primary-500 p-4 flex flex-col gap-16 transition-opacity ease-in-out delay-75 duration-150 mobile-nav z-[1000] absolute w-full
        ${isOpen ? 'block' : 'hidden'}  `}
        >
          <div className="flex flex-col gap-4 user-menu">
            <div className="flex flex-col-reverse justify-between gap-4">
              {' '}
              {/* user profile starts here */}
              <UserProfile user_name={userDetails?.firstName} image_url={imageUrl ?? '/niel.png'} />
              {/* notification menu bar starts */}
              <NotificationNavbar
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                pendingOrderCount={pendingOrderCount}
              />
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
        <div className="absolute top-0 w-full p-4 bg-grey-900 ">
          <div className="relative flex items-center p-2 border-2 bg-grey-900 border-primary-400">
            <SearchIcon width={'24px'} height={'24px'} fillColor="#fff" />
            <PredictiveSearch searchVariant="mobile" />
            <Button
              className="p-2 bg-semantic-danger-500 hover:bg-semantic-danger-500"
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
