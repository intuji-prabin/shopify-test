import {
  Email,
  PrintMinor,
  PhoneMajor,
  LocationsMinor,
  InventoryMajor,
} from '~/components/icons/orderStatus';
import { Data } from './company-profile.server';

export default function CompanyProfileDetail({ data }: { data: Data }) {
  const companyNode = data?.companies?.nodes[0];
  const metaNode = companyNode?.metafields?.nodes.length > 0 ? companyNode.metafields.nodes.filter((meta: any) => meta.key === 'fax')[0].value : null;
  const locationNode = companyNode?.locations?.nodes[0];
  return (
    <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-6">
      <div className="flex flex-col gap-6 max-w-[unset] lg:max-w-[650px] xl:max-w-[805px]">
        <div className="">
          <div className="flex items-center gap-4">
            <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
              <img src={distributorLogo} alt="distributor company logo" />
            </figure>
            <h3>{companyNode?.name}</h3>
          </div>
          <div className=" max-w-[439px]">
            <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 text-grey-700 sm:grid-cols-2 ">
              <li className="settings-card-detail">
                <Email />
                {companyNode?.mainContact?.customer?.email}
              </li>
              <li className="settings-card-detail">
                <PrintMinor />{metaNode}
              </li>
              <li className="settings-card-detail">
                <PhoneMajor />
                {locationNode?.billingAddress?.phone}
              </li>
              <li className="settings-card-detail">
                <LocationsMinor />
                {locationNode?.billingAddress?.address1}
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-grey-700 text-lg font-normal leading-[22px]">
            {companyNode?.note}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6  bg-primary-50 flex-grow">
        <h5 className="text-lg italic font-bold leading-6">
          {preferedLocation}
        </h5>
        <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 gap-y-4 text-grey-700 xl:grid-cols-2">
          <li className="settings-card-detail ">
            <InventoryMajor />
            {locationNode?.name}
          </li>
          <li className="settings-card-detail ">
            <LocationsMinor /> {locationNode?.shippingAddress?.address1}
          </li>
          <li className="settings-card-detail ">
            {' '}
            <PhoneMajor />
            {locationNode?.shippingAddress?.phone}
          </li>
        </ul>
      </div>
    </div>
  );
}