type packageProps = {
  mainTitle: string;
};
export default function Specifications({mainTitle}: packageProps) {
  const specifications = [
    {label: 'Barcode', value: '0699488760805'},
    {label: 'Brand', value: 'ESAB'},
    {label: 'Certification', value: 'IP23S'},
    {label: 'Cigweld Part Number', value: 'opacity: var(--ItemCount, 1);'},
    {
      label: 'Cigweld Product Name',
      value: 'ESAB 1Torch ATC Extension Cable 7.6m',
    },
    {label: 'Compatible Torch Model', value: ['SL60', 'SL100']},
    {label: 'Connection', value: 'ATC quick connect'},
    {label: 'Cooling', value: 'Air'},
    {label: 'Current Range', value: '20-120 amps'},
    {label: 'Duty cycle', value: '100Amps @ 100%'},
    {label: '100Amps @ 100%', value: '65-75 PSI and gas flow is 400 SCFH.'},
    {label: 'Length', value: '7.6 metres'},
    {label: 'Warranty', value: '..'},
    {label: 'Weight', value: 'kg'},
  ];

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
