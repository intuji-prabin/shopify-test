import {useState} from 'react';
import ArrowDown from '~/components/icons/arrowDown';
import ArrowUp from '~/components/icons/arrowUp';
import {Button} from '~/components/ui/button';
import {useMediaQuery} from '~/hooks/useMediaQuery';

export default function Weight() {
  const matches = useMediaQuery('(min-width: 768px)');
  const [openAccordion, setOpenAccordion] = useState(matches ? true : false);
  function handleshowAccordion() {
    setOpenAccordion(!openAccordion);
    console.log('open', openAccordion);
  }
  const weight = [
    {
      id: 0,
      weightGram: '45g',
    },
    {
      id: 1,
      weightGram: '47g',
    },
    {
      id: 2,
      weightGram: '47g',
    },
    {
      id: 3,
      weightGram: '47g',
    },
  ];

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-between bg-primary-50 "
        onClick={handleshowAccordion}
      >
        <p className="text-grey-900 leading-6 font-semibold text-lg bg-primary-50 px-6 py-3">
          Weight
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
        {weight.map((gram) => {
          return (
            <p
              className="font-bold text-lg text-grey-400 leading-[26px]"
              key={gram.id}
            >
              {gram.weightGram}
            </p>
          );
        })}
      </div>
    </div>
  );
}
