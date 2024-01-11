import {ChevronDown} from 'lucide-react';
import {ReactNode, useRef, useState} from 'react';

type AccordionType = {
  accordionTitle: string;
  children: ReactNode;
};

const AccordionCustom = ({accordionTitle, children}: AccordionType) => {
  const [active, setActive] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  function toggleAccordion() {
    setActive(!active);
    setHeight(active ? '0px' : `${content?.current?.scrollHeight}px`);
  }
  return (
    <div className="border-b border-solid border-grey-50">
      <button
        type="button"
        className={`flex justify-between ${
          active ? 'active' : ''
        } cursor-pointer w-full py-4`}
        onClick={toggleAccordion}
      >
        <h5>{accordionTitle}</h5>
        <span>
          {active ? <ChevronDown className="rotate-180" /> : <ChevronDown />}
        </span>
      </button>
      <div
        ref={content}
        style={{maxHeight: `${height}`}}
        className="overflow-hidden"
      >
        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
};

export default AccordionCustom;
