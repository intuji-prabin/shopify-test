import {Link} from '@remix-run/react';
import {Twitch} from 'lucide-react';
import Facebook from '~/components/icons/facebook';
import LinkedIn from '~/components/icons/linkedin';
import Twitter from '~/components/icons/twitter';

export default function MobileFooter() {
  const footerNavs = [
    {
      id: 0,
      title: 'dashbaord',
      link: '/',
    },
    {
      id: 1,
      title: 'Products',
      link: '/my-team',
    },
    {
      id: 2,
      title: 'Accounts',
      link: '/support',
    },
    {
      id: 3,
      title: 'My Team',
      link: '/settings',
    },
    {
      id: 3,
      title: 'Warranty',
      link: '/settings',
    },
    {
      id: 3,
      title: 'Company Setings',
      link: '/settings',
    },
  ];
  const socialLinks = [
    {
      id: 0,
      icon: <Facebook />,
    },
    {
      id: 1,
      icon: <Twitter />,
    },
    {
      id: 2,
      icon: <LinkedIn />,
    },
  ];
  return (
    <div className="bg-grey-900 ">
      <div className="container">
        <div className=" flex flex-col justify-between py-20 gap-10">
          <figure className="text-center">
            <img src="footerlogo.png" alt="" />
          </figure>
          <ul className="grid  grid-cols-2	 gap-[72px]">
            {footerNavs.map((nav) => (
              <Link to={nav.link} key={nav.id}>
                <li className="text-2xl font-bold italic leading-[29px] text-white uppercase">
                  {nav.title}
                </li>
              </Link>
            ))}
          </ul>

          <ul className="flex items-center justify-center gap-6">
            {socialLinks.map((social) => (
              <li key={social.id}>{social.icon}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex border border-t-2 border-grey-700 border-x-0 border-b-0 pt-4 justify-between py-4 container">
        <p className="text-base text-white font-normal">
          Cigweld © 2024 All Rights Reserved
        </p>
        <div className="text-base font-normal [&>*]:text-white flex gap-6 ">
          <p>Privacy Policy</p>
          <p>Terms & Condition</p>
        </div>
      </div>
    </div>
  );
}
