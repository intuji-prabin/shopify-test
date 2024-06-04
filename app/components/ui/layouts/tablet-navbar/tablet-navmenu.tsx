import { useRef } from 'react';
import { TabletHamburger } from '~/components/icons/orderStatus';

import CloseMenu from '~/components/icons/closeMenu';
import { useOutsideClick } from '~/hooks/useOutsideClick';
import { Button } from '../../button';
import { useHamburgerMenu } from '../elements/HamburgerMenuContext';
import LogoutForm from '../elements/mobile-navbar/logout-form';
import NavMenu from '../elements/mobile-navbar/nav-menu';
import OrderTrackMobile from '../elements/mobile-navbar/order-track';
import UserProfile from '../elements/mobile-navbar/user-profle';

export default function TabletNavmenu({ profileName, profileImage }: { profileName: string; profileImage: string }) {
  const tabletSectionRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tabletSectionRef, () => toggleMenu(false));

  const { isOpen, toggleMenu } = useHamburgerMenu();

  return (
    <>
      <figure
        className="flex xl:hidden border border-[#313535] bg-transparent max-w-10 max-h-10 hover:bg-transparent p-2"
        onClick={() => toggleMenu(!isOpen)}
      >
        <TabletHamburger />
      </figure>
      {isOpen ? (
        <div className="absolute top-0 w-40 z-30 left-0 bg-primary-500 min-w-[300px]" ref={tabletSectionRef}>
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
          <div className="p-4 bg-primary-500">
            <NavMenu />
            <div className="flex flex-col justify-between mt-2 gap-52">
              <OrderTrackMobile />
              <LogoutForm />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
