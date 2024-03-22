type HeroImage = {
  imageUrl: string;
  sectionName: string;
};
export default function HeroBanner({imageUrl, sectionName}: HeroImage) {
  return (
    <div className="relative">
      <figure className=" h-full">
        <img
          src={imageUrl}
          alt="Hero section of the page"
          className="max-h-[320px] w-full object-cover object-center"
        />
      </figure>
      <p className="absolute top-1/2 left-1/2 font-bold italic text-white text-2xl md:text-[40px] leading-11 -translate-x-1/2">
        {sectionName}
      </p>
    </div>
  );
}
