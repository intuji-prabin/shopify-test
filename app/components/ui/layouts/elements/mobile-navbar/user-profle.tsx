import {Link} from '@remix-run/react';
import {useHamburgerMenu} from '../HamburgerMenuContext';

type UserInfoProps = {
  user_name: string;
};
export default function UserProfile({user_name}: UserInfoProps) {
  const {isOpen, toggleMenu} = useHamburgerMenu();

  return (
    <div className="flex gap-2">
      <figure>
        <img src="/niel.png" alt="" />
      </figure>
      <div className="flex justify-between w-full items-center flex-row md:flex-col md:items-baseline ">
        <p className="text-lg font-normal text-white not-itallic md:text-base md:font-bold md:italic">
          {user_name}
        </p>
        <Link
          to=""
          className="font-bold text-lg md:text-sm leading-6 italic text-white border-b-2 border-white border-x-0 border-t-0 uppercase"
          onClick={() => toggleMenu(!isOpen)}
        >
          my profile
        </Link>
      </div>
    </div>
  );
}
