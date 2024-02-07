import {useState} from 'react';
import ArrowDown from '~/components/icons/arrowDown';
import ArrowUp from '~/components/icons/arrowUp';

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
      className={`accordion-item p-1 ${
        isActive && <div className="accordion-content mt-3">{content}</div>
      }`}
    >
      <div
        className="accordion-title flex justify-between text-lg font-bold text-grey-900 italic leading-[22px] bg-primary-50 items-center "
        onClick={() => setIsActive(!isActive)}
      >
        <p className="text-grey-900 leading-6 font-semibold text-lg  px-6 py-3">
          {title}
        </p>
        <div>
          {isActive ? (
            <ArrowUp fillColor="#0F1010" />
          ) : (
            <ArrowDown fillColor="#0F1010" />
          )}
        </div>
      </div>
      {isActive && <div className="accordion-content mt-3">{content}</div>}
    </div>
  );
};

const ComparisonAccordion = () => {
  const accordionData = [
    {
      title: 'Filter Lens Dimensions',
      content: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis sapiente
      laborum cupiditate possimus labore, hic temporibus velit dicta earum
      suscipit commodi eum enim atque at? Et perspiciatis dolore iure
      voluptatem.`,
    },
    {
      title: 'On/Off Control',
      content: `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Mollitia veniam
      reprehenderit nam assumenda voluptatem ut. Ipsum eius dicta, officiis
      quaerat iure quos dolorum accusantium ducimus in illum vero commodi
      pariatur? Impedit autem esse nostrum quasi, fugiat a aut error cumque
      quidem maiores doloremque est numquam praesentium eos voluptatem amet!
      Repudiandae, mollitia id reprehenderit a ab odit!`,
    },
    {
      title: 'Operating Temperature',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
      quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
      dolor ut sequi minus iste? Quas?`,
    },
    {
      title: ' Power Supply',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
        quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
        dolor ut sequi minus iste? Quas?`,
    },
    {
      title: ' Sensors',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
        quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
        dolor ut sequi minus iste? Quas?`,
    },
    {
      title: 'weight',
      content: `Sapiente expedita hic obcaecati, laboriosam similique omnis architecto ducimus magnam accusantium corrupti
        quam sint dolore pariatur perspiciatis, necessitatibus rem vel dignissimos
        dolor ut sequi minus iste? Quas?`,
    },
  ];

  return (
    <div className="p-6">
      <div>
        {accordionData.map(({title, content}, index) => (
          <AccordionItem key={index} title={title} content={content} />
        ))}
      </div>
    </div>
  );
};

export default ComparisonAccordion;
