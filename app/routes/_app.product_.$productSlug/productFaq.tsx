import { useState } from 'react';

const AccordionItem = ({
  title,
  content,
}: {
  title?: string;
  content?: string;
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`accordion-item p-4 border-[#CDD6DA40] border-[1px] ${isActive && <div className="mt-3 accordion-content">{content}</div>
        }`}
    >
      <div
        className="accordion-title flex justify-between text-lg font-bold text-grey-900 italic leading-[22px] "
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className="mt-3 accordion-content">{content}</div>}
    </div>
  );
};
type packageProps = {
  mainTitle: string;
  accordionData: { answer: string; question: string }[];
};
const ProductFaq = ({ mainTitle, accordionData }: packageProps) => {
  return (
    <div>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase ">
        {mainTitle}
      </h3>

      <div className="product-accordion">
        {accordionData.map((item, index) => (
          <AccordionItem key={index} title={item?.question} content={item?.answer} />
        ))}
      </div>
    </div>
  );
};

export default ProductFaq;
