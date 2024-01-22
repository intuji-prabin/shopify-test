import { Link } from '@remix-run/react';
import { Arrowleft } from '~/components/icons/arrowleft';
import {
  CircleInformationMajor,
  Email,
  InventoryMajor,
  LocationsMinor,
  PhoneMajor,
  PrintMinor,
} from '~/components/icons/orderStatus';

export default function Company_Profile_Management() {
  return (
    <div className="container py-12 bg-primary-25 ">
      <div>
        <div className="mb-[32px] flex flex-col gap-[6px]">
          <div className="flex gap-4 ">
            <button className="border-[1px] border-grey-100 h-10 w-10 flex items-center justify-center">
              <Arrowleft />
            </button>
            <h3 className="text-grey-900">Company Settings Management</h3>
          </div>
          <ul className="flex gap-1 layout-breadcrumb">
            <li>Company Settings</li>
            <li>/</li>
            <li>Company Profile Management</li>
          </ul>
        </div>
        <div className="flex gap-2 px-4 py-2 mb-2 border-l-4 border-r-0 bg-semantic-info-100 border-semantic-info-500 border-y-0">
          <CircleInformationMajor />
          <p className="text-base font-normal ">
            To edit or add new details please{' '}
            <span className="underline text-semantic-info-500">
              <Link to="">contact us.</Link>
            </span>
          </p>
        </div>

        <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-0">
          <div className="flex flex-col gap-6 max-w-[unset] lg:max-w-[650px] xl:max-w-[805px]">
            <div className="">
              <div className="flex items-center gap-4">
                <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
                  <img src="AncLogo.png" alt="" />
                </figure>
                <h3>ANC Distributor</h3>
              </div>
              <div className=" max-w-[439px]">
                <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 text-grey-700 sm:grid-cols-2 ">
                  <li className="settings-card-detail">
                    <Email />
                    support@ancdistributor.com
                  </li>
                  <li className="settings-card-detail">
                    <PrintMinor /> +61 414 (123) 456 789
                  </li>
                  <li className="settings-card-detail">
                    <PhoneMajor />
                    +61 414 (123) 456 789
                  </li>
                  <li className="settings-card-detail">
                    <LocationsMinor />
                    New South Wales, Australia
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <p className="text-grey-700 text-lg font-normal leading-[22px]">
                ANC is a leading distributor of high-quality welding equipment
                and supplies. With a commitment to excellence and a passion for
                welding, we provide a comprehensive range of cutting-edge
                welding machines, consumables, and accessories. Our mission is
                to empower welders of all skill levels with the tools they need
                to create strong, durable connections.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-6  bg-primary-50">
            <h5 className="text-lg italic font-bold leading-6">
              Preferred Inventory Location
            </h5>
            <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 gap-y-4 text-grey-700 xl:grid-cols-2">
              <li className="settings-card-detail ">
                <InventoryMajor />
                Supercheap Auto Belmont
              </li>
              <li className="settings-card-detail ">
                <LocationsMinor /> Belmont WA 6104
              </li>
              <li className="settings-card-detail ">
                <PhoneMajor />
                08 9477 5699
              </li>
              <li className="settings-card-detail ">
                <PhoneMajor />
                6.4km
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
