import {Link} from '@remix-run/react';

type UserInfoProps = {
  user_name: string;
};
export default function UserProfle({user_name}: UserInfoProps) {
  return (
    <div className="flex gap-2 ">
      <figure>
        <img src="/niel.png" alt="" />
      </figure>
      <div className="flex justify-between w-full items-center">
        <p className="text-lg font-normal text-white">{user_name}</p>
        <Link
          to=""
          className="font-bold text-lg leading-6 italic text-white border-b-2 border-white border-x-0 border-t-0 uppercase"
        >
          my profile
        </Link>
      </div>
    </div>
  );
}
