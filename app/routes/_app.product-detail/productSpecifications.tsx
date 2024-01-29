import {specifications} from './product-specification';

type packageProps = {
  mainTitle: string;
};
export default function Specifications({mainTitle}: packageProps) {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8">
        {mainTitle}
      </h3>
      <ul className="specification-tab">
        {specifications.map((specification, index) => (
          <li key={index}>
            <p>{specification.label}</p>
            {Array.isArray(specification.value) ? (
              <ul className="flex list-disc flex-col border-0">
                {specification.value.map((item, innerIndex) => (
                  <li key={innerIndex}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{specification.value}</p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
