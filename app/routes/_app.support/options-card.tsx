import {Link} from '@remix-run/react';
import {type OptionsCardType} from '~/routes/_app.support/options-data';

export function OptionsCard({icon, title, description, link}: OptionsCardType) {
  return (
    <Link
      to={link}
      className="bg-neutral-white duration-300 border border-solid border-transparent hover:border hover:border-solid hover:border-primary-500 hover:bg-primary-100"
    >
      <figure className="group p-6 flex flex-col gap-y-4 ">
        <div className="h-14 w-14 p-4 bg-primary-100 rounded-full group-hover:bg-primary-300 duration-300">
          {icon}
        </div>
        <figcaption>
          <h5 className="mb-2">{title}</h5>
          <p>{description}</p>
        </figcaption>
      </figure>
    </Link>
  );
}
