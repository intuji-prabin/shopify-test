import {useCallback, useState, useEffect} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {EmblaCarouselType, EmblaOptionsType} from 'embla-carousel-react';
import {LeftArrow} from '../icons/left';
import AutoHeight from 'embla-carousel-auto-height';

type ImageType = {
  src: string;
  alt: string;
};

type PropType = {
  options?: EmblaOptionsType;
  images: ImageType[];
  sectionClass?: string;
};

const Carousel = (props: PropType) => {
  const {options, images, sectionClass} = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [AutoHeight()]);
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return (
    <section className={`relative overflow-hidden embla ${sectionClass}`}>
      <div
        className="embla__viewport"
        ref={emblaRef}
        // style={{maxHeight: maxHeight + 'px'}}
      >
        <div className="flex embla__container">
          {images.map((image, index) => {
            return (
              image?.src && (
                <div key={index} className="min-w-0 embla__slide flex-full">
                  <img
                    src={image?.src}
                    alt={image?.alt}
                    className="object-cover object-center w-full"
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
      {images.length > 1 && (
        <>
          <div className="container absolute inset-y-1/2 inset-x-0">
            <button
              className="absolute z-10 flex items-center justify-center h-auto -translate-y-1/2 cursor-pointer w-7 sm:w-12 left-4 md:left-8 embla__button embla__next aspect-square top-1/2 bg-grey-900/70"
              onClick={scrollPrev}
              disabled={prevBtnDisabled}
            >
              <LeftArrow />
            </button>
            <button
              className="absolute z-10 flex items-center justify-center h-auto rotate-180 -translate-y-1/2 cursor-pointer w-7 sm:w-12 right-4 md:right-8 embla__button embla__prev aspect-square top-1/2 bg-grey-900/70"
              onClick={scrollNext}
              disabled={nextBtnDisabled}
            >
              <LeftArrow />
            </button>
          </div>
          <div className="absolute inset-x-0 text-center embla__dots bottom-3">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                type="button"
                className={'w-2 sm:w-3 aspect-square mx-0.5 sm:mx-1 bg-grey-50 rounded-full embla__dot'.concat(
                  index === selectedIndex
                    ? ' embla__dot--selected bg-secondary-500'
                    : '',
                )}
              ></button>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default Carousel;
