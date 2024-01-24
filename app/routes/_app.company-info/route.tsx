import {Link} from '@remix-run/react';
import {settingCards} from './settingCards';

export default function Settings() {
  return (
    <>
      <div className="bg-primary-25 container py-12 ">
        <h3 className="mb-[42px] text-grey-900">Company Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {settingCards.map((settingCard) => (
            <div className="p-6 bg-white max-w-[627px] flex gap-[35px] flex-col">
              <div className="flex flex-col gap-[35px]" key={settingCard.id}>
                <div className="flex  gap-2 flex-col ">
                  <h4>{settingCard.title}</h4>
                  <p>{settingCard.description}</p>
                </div>
                <button className="uppercase text-sm italic font-bold py-2 px-6 bg-primary-500 text-white max-w-[116px]">
                  <Link to={settingCard.link}>{settingCard.btnText}</Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
