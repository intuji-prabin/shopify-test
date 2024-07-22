import { useRef } from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import { TabletHamburger } from '~/components/icons/orderStatus';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { Button } from '../../button';
import { useHamburgerMenu } from '../elements/HamburgerMenuContext';
import LogoutForm from '../elements/mobile-navbar/logout-form';
import NavMenu from '../elements/mobile-navbar/nav-menu';
import OrderTrackMobile from '../elements/mobile-navbar/order-track';
import UserProfile from '../elements/mobile-navbar/user-profle';

export default function TabletNavmenu({ profileName, profileImage, cartCount }: { profileName: string; profileImage: string, cartCount:number }) {
  const tabletSectionRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tabletSectionRef, () => toggleMenu(false));

  const { isOpen, toggleMenu } = useHamburgerMenu();

  return (
    <>
      <p
        className='flex italic font-medium text-secondary-500 xl:hidden border border-[#313535] py-2 px-3'
        onClick={() => toggleMenu(!isOpen)}
      >
        MENU
      </p>
      <div className={`${isOpen ? "block xl:hidden" : "hidden"} absolute top-0 z-30 left-0 right-0 bg-black/80`}>
        <div className="w-40 bg-primary-500 min-w-[310px] h-screen" ref={tabletSectionRef}>
          <div className="flex items-center justify-between p-4 bg-grey-900 tab-header">
            <UserProfile user_name={profileName} image_url={profileImage} />
            <Button
              className="bg-semantic-danger-500 p-1 hover:bg-semantic-danger-500 w-[28px] h-[28px]"
              onClick={() => {
                toggleMenu(!isOpen)
              }}
            >
              <CloseMenu fillColor="#fff" />
            </Button>
          </div>
          <div className="flex flex-col p-4 bg-primary-500 justify-between h-[calc(100%_-_78px)] overflow-y-auto gap-y-11">
            <div className='flex flex-col gap-4'>
              <NavMenu />
              <OrderTrackMobile cartCount={cartCount} />
            </div>
            <LogoutForm />
          </div>
        </div>
      </div>
    </>
  );
}
