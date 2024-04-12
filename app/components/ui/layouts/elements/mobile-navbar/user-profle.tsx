import { Link } from '@remix-run/react';
import { useHamburgerMenu } from '../HamburgerMenuContext';
import { Routes } from '~/lib/constants/routes.constent';

type UserInfoProps = {
  user_name: string;
  image_url: string;
};
export default function UserProfile({ user_name, image_url }: UserInfoProps) {
  const { isOpen, toggleMenu } = useHamburgerMenu();

  return (
    <div className="flex gap-2">
      <figure className='w-8 h-8'>
        <img src={image_url} alt="profile-image" className="object-cover object-center w-full h-full rounded-full" />
      </figure>
      <div className="flex flex-row items-center justify-between w-full md:flex-col md:items-baseline ">
        <p className="text-lg font-normal text-white not-itallic md:text-base md:font-bold md:italic">
          {user_name}
        </p>
        <Link
          to={Routes.PROFILE}
          className="text-lg italic font-bold leading-6 text-white uppercase border-t-0 border-b-2 border-white md:text-sm border-x-0"
          onClick={() => toggleMenu(!isOpen)}
        >
          my profile
        </Link>
      </div>
    </div>
  );
}
