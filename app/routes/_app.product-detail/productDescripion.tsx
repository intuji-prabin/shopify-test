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
  const descriptions = [
    {
      id: 0,
      desc: `To Celebrate Cigwelds 100 year Anniversary, we are introducing for a 
      limited time this authentic 100 year Prolite Welding Helmet to 
      celebrate, The TERRA!`,
    },

    {
      id: 1,
      desc: ` The ‘TERRA’, meaning ‘land’, is a design that is a nod to the heavy
industries that have built and driven this country to what it is
today`,
    },
    {
      id: 2,
      desc: `This helmet features all the good stuff that we have managed to cram
      into the industry leading ProLite helmet with an awesome new skin.`,
    },
    {
      id: 3,
      desc: `The perfect auto-darkening welding helmet specifically developed for
      comfort and protection to get the job done!`,
    },
    {
      id: 4,
      desc: ` Whether you’ve got your nose to the grindstone or you’re striking an
      arc, a simple switch allows you to choose between welding and
      grinding modes.`,
    },
    {
      id: 5,
      desc: ` The ‘TERRA’, meaning ‘land’, is a design that is a nod to the heavy
industries that have built and driven this country to what it is
today`,
    },
    {
      id: 6,
      desc: `  Four sensors detect the arc and darken the lens in 0.2ms. Even at
      very low amperages, the adjustable shade auto-darkening welding
      helmet remains dark which makes it ideal for TIG work as well as
      more powerful stick and MIG jobs.`,
    },
    {
      id: 7,
      desc: ` The ProLite range is fully compliant with Australian standards,
      which means you’re buying from a brand you can trust.`,
    },
  ];

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
