import {NotificationIcon} from '../../icons/notification';
import {Cart, Heart} from '../../icons/orderStatus';
import {FaSearch} from 'react-icons/fa';
import {useState} from 'react';
import CloseMenu from '~/components/icons/closeMenu';
import HamburgerIcon from '~/components/icons/hamburgerIcon';
import {Signout} from '~/components/icons/signout';
import {Note} from '~/components/icons/note';
import {Button} from '../button';
import SearchIcon from '~/components/icons/search';
import {Link} from '@remix-run/react';
import {TrackAnOrderButton} from './elements/track-an-order-dialog';
import {Routes} from '~/lib/constants/routes.constent';

export default function MobileNav() {
  const [isHamOpen, setIsHamOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navIcons = [
    {
      id: 1,
      icon: <Cart />,
      notification: '3',
    },
    {
      id: 2,
      icon: <Note />,
      notification: '3',
    },
    {
      id: 3,
      icon: <Heart />,
      notification: '3',
    },
    {
      id: 4,
      icon: <NotificationIcon />,
      notification: '3',
    },
  ];
  const navigations = [
    {
      id: 0,
      title: 'Home',
    },
    {
      id: 1,
      title: 'dashboard',
    },
    {
      id: 2,
      title: 'All products',
    },
    {
      id: 4,
      title: 'Blogs',
    },
  ];
  return (
    <>
      <div className="bg-grey-900 px-4 py-6 flex justify-between items-center relative">
        <Link to="">
          <figure>
            <img src="logo.png" alt="" />
          </figure>
        </Link>
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
        className={`bg-primary-500 p-4 flex flex-col gap-[195px] transition-opacity ease-in-out delay-75 duration-150 
        ${isHamOpen ? 'opacity-100' : 'opacity-0'}  `}
      >
        <div className="user-menu flex gap-4 flex-col">
          <div className="flex justify-between flex-col-reverse gap-4">
            {' '}
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
            <ul className="nav-list flex gap-3 items-center h-full justify-around">
              {navIcons.map((navIcon) => (
                <li className="nav-item relative" key={navIcon.id}>
                  <div className="absolute bg-semantic-danger-500 h-[14px] w-[14px] rounded-[50%] right-[-9px] top-[-9px] flex items-center justify-center text-xs text-white font-medium p-2">
                    {navIcon.notification}
                  </div>
                  <a className="nav-link">{navIcon.icon}</a>
                  <div className=""></div>
                </li>
              ))}
            </ul>
          </div>

          <ul className="flex flex-col gap-4">
            {navigations.map((navigation) => (
              <li
                key={navigation.id}
                className="italic uppercase font-bold text-base text-white hover:text-secondary-500  active:text-secondary-500"
              >
                <a href="" className="w-full block">
                  {navigation.title}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 flex-row-reverse  ">
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
        </div>
        <div className="flex gap-[2px]">
          <Signout />
          <p className="italic uppercase font-bold text-base text-white">
            sign out
          </p>
        </div>
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
