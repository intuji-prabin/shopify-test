type packageProps = {
  mainTitle: string;
  packageTitleFirst: string;
  packageTitleSecond: string;
  tableTitle: string;
};
import {accesitems, automated, contentItems, packages} from './packageContent';
export default function PackageContents({
  mainTitle,
  packageTitleFirst,

  packageTitleSecond,
  tableTitle,
}: packageProps) {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8">
        {mainTitle}
      </h3>
      <div className="packages flex flex-col gap-10">
        <div className="package-names flex flex-col gap-[30px]">
          <h3 className="text-[36px] italic font-bold leading-[36px] uppercase">
            {packageTitleFirst}
          </h3>
          <div className="border-[1px] border-grey-25 flex flex-col">
            <h5 className="bg-[#f5f5f5] text-lg italic font-bold leading-6 text-grey-900 py-2 text-center">
              {tableTitle}
            </h5>

            <div className="options flex gap-8">
              <div className="p-4 flex flex-col gap-3 basis-[50%]">
                <h5>ACCESSORY EQUIPMENT</h5>
                <ul className="list-disc ml-4">
                  {accesitems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border-l-[1px] border-x-0 border-r-0 border-grey-25 flex flex-col gap-3 basis-[50%]">
                <h5>Automated & Mechanised Torch</h5>
                <ul className="list-disc ml-4">
                  {automated.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="packages flex flex-col gap-[30px]">
          <h3 className="text-[36px] italic font-bold leading-[36px] uppercase">
            {packageTitleSecond}
          </h3>
          <ul className="list-disc ml-4">
            {packages.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <div className="border-[1px] border-grey-25 flex flex-col">
            <h5 className="bg-[#f5f5f5] text-lg italic font-bold leading-6 text-grey-900 py-2 text-center">
              {tableTitle}
            </h5>

            <div className="options flex gap-8">
              <div className="p-4 flex flex-col gap-3 basis-[50%]">
                <h5 className="uppercase">
                  1Torch SL60 ELECTRODES & FRONT END TORCH PARTS
                </h5>
                <ul className="list-disc ml-4">
                  <li>
                    OTD9/8205 Plasma 1 Torch Cutting Tip 20A - Drag, 5ea/pk
                  </li>
                  <li>
                    OTD9/8206 Plasma 1 Torch Cutting Tip 30A - Drag, 5ea/pk
                  </li>
                  <li>
                    OTD9/8207 Plasma 1 Torch Cutting Tip 40A - Drag, 5ea/pk
                  </li>
                  <li>
                    OTD9/8208 Plasma 1 Torch Cutting Tip 40A - Stand Off, 5ea/pk
                  </li>
                  <li>
                    OTD9/8210 Plasma 1 Torch Cutting Tip 60A - Stand Off, 5ea/pk
                  </li>
                  <li>
                    OTD9/8211 Plasma 1 Torch Cutting Tip 80A - Stand Off, 5ea/pk
                  </li>
                  <li>OTD9/8215 Electrode 1 Torch, Long Life 5ea/pk</li>
                  <li>OTD9/8218 Shield Cup 1 Torch, 1ea</li>
                </ul>
              </div>
              <div className="p-4 border-l-[1px] border-x-0 border-r-0 border-grey-25 flex flex-col gap-3 basis-[50%]">
                <h5 className="uppercase">
                  {' '}
                  1Torch SL100 ELECTRODES & FRONT END TORCH PARTS
                </h5>
                <ul className="list-disc ml-4">
                  {contentItems.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
