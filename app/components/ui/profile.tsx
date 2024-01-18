import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';
import { CalendarIconBlue } from '../icons/calendar-icon';
import { Designation } from '../icons/designation';
import { Office } from '../icons/office';
import useDate from '~/hooks/useDate';

type PropType = {
  sectionClass?: string;
};

const Profile = ({ sectionClass }: PropType) => {
  const currentDate = useDate();
  return (
    <section className={`container ${sectionClass}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
        <div className="flex flex-wrap items-center justify-center order-2 w-full gap-x-4 gap-y-2 sm:w-auto sm:order-1 xs:justify-start">
          <div className="border-4 border-white border-solid rounded-full max-w-28 aspect-square">
            <img src={DEFAULT_IMAGE.DEFAULT} alt="profile" className="rounded-full" />
          </div>
          <div className="text-center xs:space-y-1 xs:text-left">
            <p className="text-base italic font-bold leading-7 lg:text-lg xl:text-2xl text-grey-500">
              Good Afternoon
            </p>
            <div className="space-y-2">
              <h2>Niel De Grass</h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2 profile__details">
                <div className="flex flex-wrap relative w-full xs:w-auto items-center gap-1 xs:after:content-[''] xs:after:bg-grey-100 xs:after:w-px xs:after:h-6 xs:after:absolute xs:after:-right-3 justify-center xs:justify-start">
                  <Designation />
                  <p className="text-base lg:text-lg lg:leading-[22px] font-medium text-grey-900">
                    Purchasing Officer
                  </p>
                </div>
                <div className="flex flex-wrap relative w-full xs:w-auto items-center gap-1 xs:after:content-[''] xs:after:bg-grey-100 xs:after:w-px xs:after:h-6 xs:after:absolute xs:after:-right-3 justify-center xs:justify-start">
                  <Office />
                  <p className="text-base lg:text-lg lg:leading-[22px] font-medium text-grey-900">
                    ANC Distributors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center order-1 w-full gap-1 lg:gap-2 sm:w-auto sm:order-2 profile__date xs:justify-start sm:justify-end">
          <CalendarIconBlue />
          <span className="text-lg italic font-bold leading-9 lg:text-xl xl:text-3xl">
            {currentDate.currentDate} {currentDate.currentLongMonth}, {currentDate.currentYear}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Profile;
