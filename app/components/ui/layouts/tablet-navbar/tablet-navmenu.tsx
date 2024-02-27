import {SetStateAction, useRef, useState} from 'react';
import {TabletHamburger} from '~/components/icons/orderStatus';

import NavMenu from '../elements/mobile-navbar/nav-menu';
import UserProfile from '../elements/mobile-navbar/user-profle';
import OrderTrackMobile from '../elements/mobile-navbar/order-track';
import LogoutForm from '../elements/mobile-navbar/logout-form';
import {Button} from '../../button';
import CloseMenu from '~/components/icons/closeMenu';
import {useOutsideClick} from '~/hooks/useOutsideClick';

export default function TabletNavmenu() {
  const [ishamburgerOpen, setIsHamburgerOpen] = useState(false);
  const tabletSectionRef = useRef<HTMLDivElement>(null);
  useOutsideClick(tabletSectionRef, () => setIsHamburgerOpen(false));

  function handleHamburgerOpen() {
    setIsHamburgerOpen(!ishamburgerOpen);
  }
  return (
    <>
      <figure
        className="flex xl:hidden border border-[#313535] bg-transparent max-w-10 max-h-10 hover:bg-transparent p-2"
        onClick={handleHamburgerOpen}
      >
        <TabletHamburger />
      </figure>
      {ishamburgerOpen ? (
        <div ref={tabletSectionRef}>
          <div className="absolute top-0 w-40 z-30 left-0 bg-primary-500 min-w-[300px]">
            <div className="bg-grey-900 p-4 flex justify-between items-center">
              <UserProfile user_name={'Neil de grass'} />
              <Button
                className="bg-semantic-danger-500 p-1 hover:bg-semantic-danger-500 w-[28px] h-[28px]"
                onClick={() => {
                  setIsHamburgerOpen(!ishamburgerOpen);
                }}
              >
                <CloseMenu fillColor="#fff" />
              </Button>
            </div>
            <div className="bg-primary-500 p-4">
              {' '}
              <NavMenu />
              <div className="flex flex-col justify-between gap-52 mt-2">
                <OrderTrackMobile />
                <LogoutForm />
              </div>
            </div>{' '}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
