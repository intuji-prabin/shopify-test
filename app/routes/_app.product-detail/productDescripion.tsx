export default function ProductDescripion() {
  return (
    <>
      <h3 className="text-[30px] italic font-bold leading-[36px]  mb-8 uppercase">
        Description
      </h3>
      <div className="flex flex-col gap-8">
        <figure>
          <img src="productDesc.png" alt="" />
        </figure>
        <ul className="list-none flex flex-col gap-3 text-base font-normal leading-[21px] text-grey-700">
          <li>
            To Celebrate Cigwelds 100 year Anniversary, we are introducing for a
            limited time this authentic 100 year Prolite Welding Helmet to
            celebrate, The TERRA!
          </li>
          <li>
            The ‘TERRA’, meaning ‘land’, is a design that is a nod to the heavy
            industries that have built and driven this country to what it is
            today.
          </li>
          <li>
            This helmet features all the good stuff that we have managed to cram
            into the industry leading ProLite helmet with an awesome new skin.
          </li>
          <li>
            The perfect auto-darkening welding helmet specifically developed for
            comfort and protection to get the job done!
          </li>
          <li>
            Whether you’ve got your nose to the grindstone or you’re striking an
            arc, a simple switch allows you to choose between welding and
            grinding modes.
          </li>
          <li>
            Four sensors detect the arc and darken the lens in 0.2ms. Even at
            very low amperages, the adjustable shade auto-darkening welding
            helmet remains dark which makes it ideal for TIG work as well as
            more powerful stick and MIG jobs.
          </li>
          <li>
            The ProLite range is fully compliant with Australian standards,
            which means you’re buying from a brand you can trust.
          </li>
        </ul>
        <figure>
          <img src="cigweld100yr.png" alt="" />
        </figure>
      </div>
    </>
  );
}
