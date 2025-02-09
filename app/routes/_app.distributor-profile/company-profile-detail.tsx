import {
  Email,
  InventoryMajor,
  LocationsMinor,
  PhoneMajor,
  PrintMinor,
} from '~/components/icons/orderStatus';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { CompanyProfile } from '~/routes/_app.distributor-profile/company-profile.server';

export default function CompanyProfileDetail({
  companyProfileDetails,
}: {
  companyProfileDetails: CompanyProfile;
}) {
  return (
    <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-6">
      <div className="flex flex-col flex-grow gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
              <img
                src={companyProfileDetails?.logoUrl ?? DEFAULT_IMAGE.LOGO}
                alt="company_logo"
                className="w-[96px] h-[96px] rounded-[50%] object-cover"
              />
            </figure>
            <h3>{companyProfileDetails?.companyName || '-'}</h3>
          </div>
          <ul className="flex flex-wrap gap-4 font-medium flex-col-sm text-grey-700">
            <li className=" settings-card-detail">
              <Email />
              <p className=" comapny-setting-text">
                {companyProfileDetails?.companyEmail || '-'}
              </p>
            </li>
            <li className=" settings-card-detail">
              <PrintMinor />
              <p className="comapny-setting-text">
                {companyProfileDetails?.companyFax || '-'}
              </p>
            </li>
          </ul>
          <ul className="flex flex-wrap gap-4 font-medium flex-col-sm text-grey-700">
            {' '}
            <li className=" settings-card-detail">
              <PhoneMajor />
              <p className="comapny-setting-text">
                {companyProfileDetails?.phone || '-'}
              </p>
            </li>
            <li className=" settings-card-detail">
              <LocationsMinor />
              <p className="comapny-setting-text">
                {companyProfileDetails?.address || '-'}
              </p>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-grey-700 text-lg font-normal leading-[22px]">
            {companyProfileDetails?.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 bg-primary-50 sm:w-max">
        <h5 className="text-lg italic font-bold leading-6 sm:text-nowrap">
          Preferred Inventory Location
        </h5>
        <ul>
          <li className="break-all settings-card-detail">
            <InventoryMajor />
            {companyProfileDetails?.inventoryLocationName || '-'}
          </li>
        </ul>
      </div>
    </div>
  );
}
