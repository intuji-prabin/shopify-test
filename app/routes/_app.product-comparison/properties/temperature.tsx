import {useState} from 'react';
import ArrowDown from '~/components/icons/arrowDown';
import ArrowUp from '~/components/icons/arrowUp';
import {Button} from '~/components/ui/button';
import { useMediaQuery } from '~/hooks/useMediaQuery';

export default function Temperature() {
  const matches = useMediaQuery('(min-width: 768px)');
  const [openAccordion, setOpenAccordion] = useState(matches ? true : false);
  function handleshowAccordion() {
    setOpenAccordion(!openAccordion);
  }
  const operatingTemp = [
    {
      id: 0,
      temperature: '-5C to 55C',
    },
    {
      id: 1,
      temperature: '-5C to 55C',
    },
    {
      id: 2,
      temperature: '-5C to 55C',
    },
    {
      id: 3,
      temperature: '-5C to 55C',
    },
  ];

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-between bg-primary-50 "
        onClick={handleshowAccordion}
      >
        <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
          Operating Temperature
        </p>
        <Button className="block md:hidden bg-primary-50 hover:bg-primary-50 ">
          {openAccordion ? (
            <ArrowUp fillColor="#0F1010" />
          ) : (
            <ArrowDown fillColor="#0F1010" />
          )}
        </Button>
      </div>
      <div
        className={`gap-6 px-6 py-3 justify-between flex-col md:flex-row  ${
          openAccordion ? 'flex' : 'hidden'
        }`}
      >
        {operatingTemp.map((temp) => {
          return (
            <p
              className="font-bold text-lg text-grey-400 leading-[26px]"
              key={temp.id}
            >
              {temp.temperature}
            </p>
          );
        })}
      </div>
    </div>
  );
}
