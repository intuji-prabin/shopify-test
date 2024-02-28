import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';

type AccordionType = {
  accordionTitle: string;
  accordianLabel: "company-information" | "text-color" | "background"
  children: ReactNode;
  isOpen?: boolean;
  setOpenAccordian: React.Dispatch<React.SetStateAction<"company-information" | "text-color" | "background" | "">>
};

const AccordionCustom = ({ accordionTitle, children, isOpen = false, setOpenAccordian, accordianLabel }: AccordionType) => {

  function toggleAccordion() {
    if (isOpen) {
      setOpenAccordian("");
    } else {
      setOpenAccordian(accordianLabel);
    }
  }

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
        className={` overflow-auto accordion__content ${isOpen ? 'block' : 'hidden'
          }`}
      >
        <div className="mb-4">{children}</div>
      </div>
    </div>
  );
};

export default AccordionCustom;
