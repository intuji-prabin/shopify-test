import {
  Email,
  PrintMinor,
  PhoneMajor,
  LocationsMinor,
  InventoryMajor,
} from '~/components/icons/orderStatus';

export default function CompanyProfileDetail() {
  return (
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
            ANC is a leading distributor of high-quality welding equipment and
            supplies. With a commitment to excellence and a passion for welding,
            we provide a comprehensive range of cutting-edge welding machines,
            consumables, and accessories. Our mission is to empower welders of
            all skill levels with the tools they need to create strong, durable
            connections.
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
  );
}
