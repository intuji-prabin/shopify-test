type productFunctionProps = {
  featureHeading: string;
};
export default function ProductFeatures({
  featureHeading,
}: productFunctionProps) {
  const productFeatures = [
    {id: 0, feature: 'Australian Standards Compliance'},
    {id: 1, feature: 'AS/NZS 1338.1 – Auto-Darkening Filter Lens.'},
    {id: 2, feature: 'Auto-Darkening Variable Shade, 9-13 filter lens fitted.'},
    {
      id: 3,
      feature: 'Ultra View Lens (True Colour Lens) with blue light filter',
    },
    {id: 4, feature: '1/1/1/1 optical clarity rating'},
    {id: 5, feature: 'Equipped with Four Arc Sensors'},
    {id: 6, feature: 'Suitability for low amperage TIG applications'},
    {id: 7, feature: 'High Impact Rating as for AS/NZS 1337.1'},
    {id: 8, feature: 'TIG Rating 5 Amps and above for DC and AC TIG welding'},
    {id: 9, feature: 'Reaction time of 0.2ms!'},
    {id: 10, feature: 'Welding / Grinding Modes'},
    {id: 11, feature: 'CIGWELD Magnification Lens Compatibility'},
    {id: 12, feature: 'Replaceable 2x CR2450 Batteries (With Solar Assist)'},
    {id: 13, feature: 'Viewing Area of 98 x 55 mm'},
    {id: 14, feature: 'Conditional 3 Year Limited Warranty!'},
  ];

  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px] mb-8 uppercase ">
        {featureHeading}
      </h3>

      <ul className="flex flex-col gap-3 text-base font-normal leading-[21px] text-grey-700 list-disc ml-3">
        {productFeatures.map((prodFeatures) => (
          <li key={prodFeatures.id}>{prodFeatures.feature}</li>
        ))}
      </ul>
    </>
  );
}
