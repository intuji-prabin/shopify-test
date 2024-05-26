import { Link } from '@remix-run/react';
import Enquire from '~/components/icons/enquire';
import Phone from '~/components/icons/phone';
import useDate from '~/hooks/useDate';
import { Can } from '~/lib/helpers/Can';

export default function DesktopFooter({ footerData }: { footerData: any }) {
  const currentDate = useDate();
  return (
    <div className="bg-grey-900 ">
      <div className="container">
        <div className="flex flex-col justify-between gap-10 py-20 md:flex-row">
          <div className="flex flex-col gap-10">
            {footerData?.logo &&
              <figure className="max-w-48">
                <img src={footerData?.logo} alt="" />
              </figure>
            }
            <div className="flex flex-col gap-[23px]">
              {footerData?.email &&
                <div className="flex">
                  <Link to={`mailto: ${footerData?.email}`}>
                    <Enquire />
                  </Link>
                  <h4 className="italic font-bold text-lg md:text-2xl leading-[29px] text-white">
                    <Link to={`mailto: ${footerData?.email}`}>{footerData?.email}</Link>
                  </h4>
                </div>
              }
              {footerData?.phoneNumber &&
                <div className="flex">
                  <Link to={`tel: ${footerData?.phoneNumber}`}>
                    <Phone />
                  </Link>
                  <h4 className="italic font-bold text-lg md:text-2xl leading-[29px] text-white">
                    <Link to={`tel: ${footerData?.phoneNumber}`}>{footerData?.phoneNumber}</Link>
                  </h4>
                </div>
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="">
              <ul className="flex flex-col gap-8">
                {footerData?.firstColumn?.firstColumnList.map((nav: any) =>
                  nav.title === 'My team' ? (
                    <Can I="view" a="view_team" key={nav.id}>
                      <Link to={nav.link}>
                        <li className="text-2xl font-bold italic leading-[29px] text-white">
                          {nav.title}
                        </li>
                      </Link>
                    </Can>
                  ) : (
                    <Link to={nav.link} key={nav.id}>
                      <li className="text-2xl font-bold italic leading-[29px] text-white">
                        {nav.title}
                      </li>
                    </Link>
                  ),
                )}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                {footerData?.secondColumn?.secondColumnTitle}
              </h4>

              <ul className="z-10 flex flex-col space-y-2 text-white submenu-nav">
                {footerData?.secondColumn?.secondColumnList?.map((prod: any) => (
                  <li key={prod.id}><Link to={prod.link}>{prod.title}</Link></li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                {footerData?.thirdColumn?.thirdColumnTitle}
              </h4>

              <ul className="flex flex-col">
                {footerData?.thirdColumn?.thirdColumnList.map((account: any) => (
                  <>
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
                        <li className="text-lg font-normal leading-[29px] text-white mb-3" key={account.id}>
                          <Link to={account.link}>{account.title}</Link>
                        </li>
                      </Can>
                    ) : (
                      <li className="text-lg font-normal leading-[29px] text-white mb-3" key={account.id}>
                        <Link to={account.link}>{account.title}</Link>
                      </li>
                    )}
                  </>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="text-2xl font-bold italic leading-[29px] text-white">
                {footerData?.fourthColumn?.fourthColumnTitle}
              </h4>

              <ul className="z-10 flex flex-col space-y-2 text-white submenu-nav">
                {footerData?.fourthColumn?.fourthColumnList?.map((mgt: any) => (
                  <li key={mgt.id}>
                    <Link to={mgt.link}>{mgt.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center justify-center gap-6 py-4 pt-4 border border-t-2 border-b-0 border-grey-700 border-x-0 md:justify-between md:flex-row md:items-baseline ">
          <p className="text-base font-normal text-white">
            Cigweld © {currentDate.currentYear} All Rights Reserved
          </p>
          {/* <div className="text-base font-normal [&>*]:text-white flex gap-6 ">
            <p>Privacy Policy</p>
            <p>Terms & Condition</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
