import { ChevronDown } from 'lucide-react';
import { ReactNode, useEffect, useRef, useState } from 'react';

type AccordionType = {
  accordionTitle: string;
  accordianLabel: "company-information" | "text-color" | "background"
  children: ReactNode;
  isOpen?: boolean;
  setOpenAccordian: React.Dispatch<React.SetStateAction<"company-information" | "text-color" | "background" | "">>
};

const AccordionCustom = ({ accordionTitle, children, isOpen = false, setOpenAccordian, accordianLabel }: AccordionType) => {
  const content = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  function toggleAccordion() {
    if (isOpen) {
      setOpenAccordian("");
      setHeight('0px');
    } else {
      setOpenAccordian(accordianLabel);
      setHeight(isOpen ? '0px' : `${content?.current?.scrollHeight}px`);
    }

  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setHeight(`${content?.current?.scrollHeight}px`);
      }, 0);
    } else {
      setHeight('0px');
    }
  }, [isOpen]);

  return (
    <div className="border-b border-solid border-grey-50 accordion__list">
      <button
        type="button"
        className={`flex justify-between ${isOpen ? 'active' : ''
          } cursor-pointer w-full py-4`}
        onClick={toggleAccordion}
      >
        <h5>{accordionTitle}</h5>
        <span>
          {isOpen ? <ChevronDown className="rotate-180" /> : <ChevronDown />}
        </span>
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${height}`, transition: 'max-height 0.3s ease' }}
        className="overflow-hidden accordion__content"
      >
        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
};

export default AccordionCustom;
