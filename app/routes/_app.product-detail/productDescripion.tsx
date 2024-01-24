import {descriptions} from './product-description';

type ProductDescripionProps = {
  productImageUrl: string;
  productDescLogo: string;
  descriptionHeading: string;
};
export default function ProductDescripion({
  productImageUrl,
  productDescLogo,
  descriptionHeading,
}: ProductDescripionProps) {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px]  mb-8 uppercase">
        {descriptionHeading}
      </h3>
      <div className="flex flex-col gap-8">
        <figure>
          <img src={productDescLogo} alt="" />
        </figure>
        <ul className="list-none flex flex-col gap-3 text-base font-normal leading-[21px] text-grey-700">
          {descriptions.map((description) => (
            <li key={description.id}>{description.desc}</li>
          ))}
        </ul>

        <figure>
          <img src={productImageUrl} className="" alt="product-image" />
        </figure>
      </div>
    </>
  );
}
