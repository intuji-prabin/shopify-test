import {useState} from 'react';

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
      className={`accordion-item p-4 border-[#CDD6DA40] border-[1px] ${
        isActive && <div className="accordion-content mt-3">{content}</div>
      }`}
    >
      <div
        className="accordion-title flex justify-between text-lg font-bold text-grey-900 italic leading-[22px] "
        onClick={() => setIsActive(!isActive)}
      >
        <div>{title}</div>
        <div>{isActive ? '-' : '+'}</div>
      </div>
      {isActive && <div className="accordion-content mt-3">{content}</div>}
    </div>
  );
};

const ProductFaq = () => {
  const accordionData = [
    {
      title: 'Tempus magna risus interdum ultricies sed urna?',
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
    },
    {
      title: 'Tempus magna risus interdum ultricies sed urna?',
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!`,
    },
    {
      title: 'Tempus magna risus interdum ultricies sed urna?',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
      quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
      dolor ut sequi minus iste? Quas?`,
    },
  ];

  return (
    <div>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase ">
        FREQUENTLY ASKED QUESTIONS
      </h3>

      <div className="product-accordion">
        {accordionData.map(({title, content}, index) => (
          <AccordionItem key={index} title={title} content={content} />
        ))}
      </div>
    </div>
  );
};

export default ProductFaq;
