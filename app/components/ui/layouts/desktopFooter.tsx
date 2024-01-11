import Enquire from '~/components/icons/enquire';
import Phone from '~/components/icons/phone';
import {Link} from '@remix-run/react';
export default function DesktopFooter() {
  const footerNavs = [
    {
      id: 0,
      title: 'home',
      link: '/',
    },
    {
      id: 1,
      title: 'my team',
      link: '/my-team',
    },
    {
      id: 2,
      title: 'support',
      link: '/support',
    },
    {
      id: 3,
      title: 'settings',
      link: '/settings',
    },
  ];
  const products = [
    {
      id: 0,
      title: 'Machines',
    },
    {
      id: 1,
      title: 'Gas Equipment',
    },
    {
      id: 2,
      title: 'Filler Metals',
    },
    {
      id: 3,
      title: 'Safety',
    },
    {
      id: 4,
      title: 'Consumables',
    },
    {
      id: 5,
      title: 'Accessories',
    },
  ];

  const accounts = [
    {
      id: 0,
      title: 'Orders',
    },
    {
      id: 1,
      title: 'Invoice',
    },
    {
      id: 2,
      title: 'Filler Metals',
    },
    {
      id: 3,
      title: 'Safety',
    },
  ];

  return (
    <div className="bg-grey-900 ">
      <div className="container">
        <div className=" flex justify-between py-20 flex-col md:flex-row gap-5 lg:gap-0">
          <div className="flex flex-col gap-10">
            <figure>
              <img src="footerlogo.png" alt="" />
            </figure>
            <div className="flex flex-col gap-[23px]">
              <div className="flex">
                <Enquire />
                <h4 className="italic font-bold text-2xl leading-[29px] text-white">
                  enquire@cigweld.com.au
                </h4>
              </div>
              <div className="flex">
                <Phone />
                <h4 className="italic font-bold text-2xl leading-[29px] text-white">
                  1300 654 674
                </h4>
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-[108px]">
            <div className="">
              <ul className="flex gap-8 flex-col">
                {footerNavs.map((nav) => (
                  <Link to={nav.link} key={nav.id}>
                    <li className="text-2xl font-bold italic leading-[29px] text-white uppercase">
                      {nav.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Products
              </h4>

              <ul className="flex flex-col gap-3">
                {products.map((product) => (
                  <Link to="" key={product.id}>
                    <li className="text-lg font-normal  leading-[29px] text-white">
                      {product.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Accounts
              </h4>

              <ul className="flex flex-col gap-3">
                {accounts.map((account) => (
                  <Link to="" key={account.id}>
                    <li className="text-lg font-normal  leading-[29px] text-white">
                      {account.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Content Management
              </h4>

              <ul className="flex flex-col gap-3">
                <Link to="">
                  <li className="text-lg font-normal  leading-[29px] text-white">
                    Promotions
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex border border-t-2 border-grey-700 border-x-0 border-b-0 pt-4 justify-between py-4">
          <p className="text-base text-white font-normal">
            Cigweld © 2024 All Rights Reserved
          </p>
          <div className="text-base font-normal [&>*]:text-white flex gap-6 ">
            <p>Privacy Policy</p>
            <p>Terms & Condition</p>
          </div>
        </div>
      </div>
    </div>
  );
}
