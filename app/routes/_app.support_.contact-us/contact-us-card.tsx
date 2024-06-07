import { PhoneIcon } from '~/components/icons/phone-icon';
import { LargeMailIcon } from '~/components/icons/mail';
import { BuildingIcon } from '~/components/icons/building-icon';
import { DEFAULT_IMAGE } from '~/lib/constants/general.constant';

export type ContactUsDataType = {
  service: string;
  imageUrl: string;
  name: string;
  phone: string;
  email: string;
  department: string;
};

export function ContactUsCard({
  service,
  imageUrl,
  name,
  phone,
  email,
  department,
}: ContactUsDataType) {
  return (
    <div>
      <h4 className="px-6 py-3 bg-primary-500 text-neutral-white">
        {service ?? '-'}
      </h4>
      <figure className="p-6 bg-neutral-white">
        <div className="flex items-center mb-4 space-x-2">
          <div className="h-14 w-14">
            <img
              src={imageUrl ?? DEFAULT_IMAGE.DEFAULT}
              alt="contact"
              className="w-full h-full object-cover rounded-[50%]"
            />
          </div>
          <h4>{name}</h4>
        </div>
        <figcaption>
          <ul className='space-y-3 mxs:space-y-0'>
            <li className="flex flex-col space-x-7 mxs:space-x-4 mxs:items-center mxs:flex-row">
              <p className="flex items-center mxs:w-24 text-lg leading-5.5 gap-1">
                <span className='w-6'>
                  <PhoneIcon width="24px" height="24px" />
                </span>
                Phone
              </p>
              <p className="text-lg leading-5.5 font-medium break-all">{phone ?? '-'}</p>
            </li>
            <li className="flex flex-col space-x-7 mxs:space-x-4 mxs:items-center mxs:flex-row">
              <p className="flex items-center mxs:w-24 text-lg leading-5.5 gap-1">
                <span className='w-6'>
                  <LargeMailIcon />
                </span>
                Email
              </p>
              <p className="text-lg leading-5.5 font-medium break-all">{email ?? '-'}</p>
            </li>
            <li className="flex flex-col space-x-7 mxs:space-x-4 mxs:items-center mxs:flex-row">
              <p className="flex items-center mxs:w-24 text-lg leading-5.5 gap-1">
                <span className='w-6'>
                  <BuildingIcon />
                </span>
                Department
              </p>
              <p className="text-lg leading-5.5 font-medium break-all">
                {department ?? '-'}
              </p>
            </li>
          </ul>
        </figcaption>
      </figure>
    </div>
  );
}
