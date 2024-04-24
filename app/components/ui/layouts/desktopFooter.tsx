import Enquire from '~/components/icons/enquire';
import Phone from '~/components/icons/phone';
import {Link} from '@remix-run/react';
import {Routes} from '~/lib/constants/routes.constent';
import {Can} from '~/lib/helpers/Can';

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
      link: Routes.TEAM,
    },
    {
      id: 2,
      title: 'support',
      link: Routes.SUPPORT,
    },
    {
      id: 3,
      title: 'settings',
      link: Routes.SETTINGS,
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
      url: Routes.ORDERS,
    },
    {
      id: 1,
      title: 'Invoice',
      url: Routes.INVOICES,
    },
    {
      id: 2,
      title: 'Filler Metals',
      url: Routes.FILTER_METALS,
    },
    {
      id: 3,
      title: 'Safety',
      url: Routes.SAFETY,
    },
  ];

  return (
    <div className="bg-grey-900 ">
      <div className="container">
        <div className="flex flex-col justify-between gap-10 py-20 md:flex-row">
          <div className="flex flex-col gap-10">
            <figure className="max-w-48">
              <img src="/myCigweldWhite.svg" alt="" />
            </figure>
            <div className="flex flex-col gap-[23px]">
              <div className="flex">
                <Enquire />
                <h4 className="italic font-bold text-lg md:text-2xl leading-[29px] text-white">
                  enquire@cigweld.com.au
                </h4>
              </div>
              <div className="flex">
                <Phone />
                <h4 className="italic font-bold text-lg md:text-2xl leading-[29px] text-white">
                  1300 654 674
                </h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="">
              <ul className="flex flex-col gap-8">
                {footerNavs.map((nav) =>
                  nav.title === 'my team' ? (
                    <Can I="view" a="view_team">
                      <Link to={nav.link} key={nav.id}>
                        <li className="text-2xl font-bold italic leading-[29px] text-white uppercase">
                          {nav.title}
                        </li>
                      </Link>
                    </Can>
                  ) : (
                    <Link to={nav.link} key={nav.id}>
                      <li className="text-2xl font-bold italic leading-[29px] text-white uppercase">
                        {nav.title}
                      </li>
                    </Link>
                  ),
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Products
              </h4>

              <ul className="z-10 flex flex-col space-y-2 text-white submenu-nav">
                {products?.map((prod) => (
                  <li key={prod.id}>{prod.title}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Accounts
              </h4>

              <ul className="flex flex-col">
                {accounts.map((account) => (
                  <Link to={account.url} key={account.id}>
                    {account.title === 'Orders' ||
                    account.title === 'Invoice' ? (
                      <Can
                        I="view"
                        a={
                          account.title === 'Orders'
                            ? 'view_orders'
                            : 'view_company_invoices'
                        }
                      >
                        <li className="text-lg font-normal leading-[29px] text-white mb-3">
                          {account.title}
                        </li>
                      </Can>
                    ) : (
                      <li className="text-lg font-normal leading-[29px] text-white mb-3">
                        {account.title}
                      </li>
                    )}
                  </Link>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                Content Management
              </h4>

              <ul className="flex flex-col gap-3">
                <li className="text-lg font-normal  leading-[29px] text-white">
                  <Link to={Routes.PROMOTIONS}> Promotions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-center gap-6 py-4 pt-4 border border-t-2 border-b-0 border-grey-700 border-x-0 md:justify-between md:flex-row md:items-baseline ">
          <p className="text-base font-normal text-white">
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
