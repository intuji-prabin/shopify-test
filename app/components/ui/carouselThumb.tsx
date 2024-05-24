import useEmblaCarousel, {EmblaOptionsType} from 'embla-carousel-react';
import {useCallback, useEffect, useState} from 'react';
import {LeftBlueArrow} from '../icons/left';

type ImageType = {
  src: string;
  alt: string;
};

type PropType = {
  options?: EmblaOptionsType;
  images: ImageType[];
};

const CarouselThumb = (props: PropType) => {
  const {options, images} = props;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(options);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  const scrollPrev = useCallback(
    () => emblaThumbsApi && emblaThumbsApi.scrollPrev(),
    [emblaThumbsApi],
  );
  const scrollNext = useCallback(
    () => emblaThumbsApi && emblaThumbsApi.scrollNext(),
    [emblaThumbsApi],
  );

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();
    emblaMainApi.on('select', onSelect);
    emblaMainApi.on('reInit', onSelect);
  }, [emblaMainApi, onSelect]);

  return (
    <>
      <div className="overflow-hidden embla">
        <div className="embla__viewport" ref={emblaMainRef}>
          <div className="flex embla__container items-start">
            {images.map((image, index) => (
              <div key={index} className="min-w-0 embla__slide flex-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full max-h-[420px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mt-2 embla-thumbs">
        <div
          className="overflow-hidden embla-thumbs__viewport"
          ref={emblaThumbsRef}
        >
          <div className="flex flex-row embla-thumbs__container gap-x-2">
            {images.map((image, index) => (
              <div key={index} className="min-w-0 embla__slide flex-quarter">
                <button
                  onClick={() => onThumbClick(index)}
                  className={'block w-full p-0 m-0 transition-opacity delay-75 bg-transparent border-0 appearance-none cursor-pointer embla-thumbs__slide__button touch-manipulation decoration-0 '.concat(
                    index === selectedIndex ? 'opacity-100' : 'opacity-20',
                  )}
                  type="button"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-20"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute z-10 flex items-center justify-center h-auto -translate-y-1/2 bg-white rounded-full cursor-pointer embla__button embla__prev -left-4 w-9 aspect-square top-1/2 swiper-button image-swiperthumb-button-next shadow-base"
          onClick={scrollPrev}
        >
          <LeftBlueArrow />
        </button>
        <button
          className="absolute z-10 flex items-center justify-center h-auto rotate-180 -translate-y-1/2 bg-white rounded-full cursor-pointer embla__button embla__next -right-4 w-9 aspect-square top-1/2 swiper-button image-swiperthumb-button-next shadow-base"
          onClick={scrollNext}
        >
          <LeftBlueArrow />
        </button>
      </div>
    </>
  );
};

export default CarouselThumb;
