import {useEffect, useState} from 'react';
import ArrowDown from '~/components/icons/arrowDown';
import ArrowUp from '~/components/icons/arrowUp';
import {Button} from '~/components/ui/button';
import {useMediaQuery} from '~/hooks/useMediaQuery';

export default function Dimensions() {
  const matches = useMediaQuery('(min-width: 768px)');
  const [openAccordion, setOpenAccordion] = useState(true);
  useEffect(() => {
    if (matches) {
      setOpenAccordion(true);
    } else {
      setOpenAccordion(false);
    }
  }, [matches]);

  function handleshowAccordion() {
    setOpenAccordion(!openAccordion);
  }
  const dimensions = [
    {
      id: 0,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 1,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 2,
      dimensionOne: '120 x 100 x 18 mm',
    },
    {
      id: 3,
      dimensionOne: '120 x 100 x 18 mm',
    },
  ];

  return (
    <div className="flex flex-col">
      <div
        className={`flex justify-between bg-primary-50 md:pointer-events-none`}
        onClick={handleshowAccordion}
      >
        <p className="text-grey-900 leading-6 font-semibold text-lg px-6 py-3">
          Filter Lens Dimensions
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
        {dimensions.map((dimens) => {
          return (
            <p
              className="font-bold text-lg text-grey-400 leading-[26px] md:border-b-0 md:border-0 border-b border-grey-25 border-x-0 border-t-0 p-2"
              key={dimens.id}
            >
              {dimens.dimensionOne}
            </p>
          );
        })}
      </div>
    </div>
  );
}
