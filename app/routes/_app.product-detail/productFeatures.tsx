import {productFeatures} from './product-features';

type productFunctionProps = {
  featureHeading: string;
};
export default function ProductFeatures({
  featureHeading,
}: productFunctionProps) {
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
