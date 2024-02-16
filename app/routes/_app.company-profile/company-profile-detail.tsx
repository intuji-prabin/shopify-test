import {
  Email,
  InventoryMajor,
  LocationsMinor,
  PhoneMajor,
  PrintMinor,
} from '~/components/icons/orderStatus';
import {DEFAULT_IMAGE} from '~/lib/constants/general.constant';
import {CompanyProfile} from '~/routes/_app.company-profile/company-profile.server';

export default function CompanyProfileDetail({
  data,
}: {
  data: CompanyProfile | null;
}) {
  const locationNode = data?.locations?.nodes[0];

  return (
    <div className="flex flex-col justify-between gap-10 p-6 bg-white setting-card-info lg:flex-row lg:gap-6">
      <div className="flex flex-col gap-6 flex-grow ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <figure className="w-[96px] h-[96px] flex items-center justify-center rounded-[50%] border border-grey-50">
              <img
                src={data?.meta?.image_url?.value ?? DEFAULT_IMAGE.LOGO}
                alt="company_logo"
                className="w-[96px] h-[96px] rounded-[50%] object-cover"
              />
            </figure>
            <h3>{data?.name ?? '-'}</h3>
          </div>
          <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 text-lg font-medium gap-x-10 text-grey-700 sm:grid-cols-2 gap-y-4 ">
              <li className="settings-card-detail  break-all">
                <Email />
                <p className="comapny-setting-text">
                  {data?.mainContact?.customer?.email ?? '-'}
                </p>
              </li>
              <li className="settings-card-detail  break-all ">
                <PrintMinor />
                <p className="comapny-setting-text">
                  {data?.meta?.fax?.value ?? '-'}{' '}
                </p>
              </li>
              <li className="settings-card-detail  break-all">
                <PhoneMajor />
                <p className="comapny-setting-text">
                  {locationNode?.billingAddress?.phone ?? '-'}
                </p>
              </li>
              <li className="settings-card-detail  break-all">
                <LocationsMinor />
                <p className="comapny-setting-text">
                  {locationNode?.billingAddress?.address1 ?? '-'}
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-grey-700 text-lg font-normal leading-[22px]">
            {data?.note}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6  bg-primary-50 basis-[60%]">
        <h5 className="text-lg italic font-bold leading-6">
          Preferred Inventory Location
        </h5>
        <ul className="grid grid-cols-1 text-lg font-medium gap-x-10 gap-y-4 text-grey-700 md:grid-cols-2">
          <li className="settings-card-detail break-all">
            <InventoryMajor />
            {locationNode?.name ?? '-'}
          </li>
          <li className="settings-card-detail break-all">
            <LocationsMinor /> {locationNode?.shippingAddress?.address1 ?? '-'}
          </li>
          <li className="settings-card-detail break-all">
            <PhoneMajor />
            {locationNode?.shippingAddress?.phone ?? '-'}
          </li>
        </ul>
      </div>
    </div>
  );
}
