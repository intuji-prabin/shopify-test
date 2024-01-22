import useEmblaCarousel, {EmblaOptionsType} from 'embla-carousel-react';
import React, {useCallback, useEffect, useState} from 'react';
import {BlueArrowDown} from '~/components/icons/arrowDown';
import {BlueArrowForward} from '~/components/icons/arrowForward';
import {LeftBlueArrow} from '~/components/icons/left';

type ImageType = {
  src: string;
  alt: string;
};

type PropType = {
  thumbNailCarouseloptions: EmblaOptionsType;
  mainCarouseloptions: EmblaOptionsType;
  images: ImageType[];
};

const CarouselThumb = ({
  thumbNailCarouseloptions,
  mainCarouseloptions,
  images,
}: PropType) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(mainCarouseloptions);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
    thumbNailCarouseloptions,
  );

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
    <section className="flex flex-col-reverse gap-[17px]   overflow-y-hidden lg:flex-row">
      {/* Thumbnail Carousel Begins Here */}
      <div className="relative  embla-thumbs h-full overflow-y-hidden">
        <div
          className="overflow-hidden embla-thumbs__viewport max-h-[489px]"
          ref={emblaThumbsRef}
        >
          <div className="flex flex-col  embla-thumbs__container gap-y-2 h-[489px]">
            {images.map((image, index) => (
              <div
                key={index}
                className=" embla__slide flex justify-center items-center "
              >
                <button
                  onClick={() => onThumbClick(index)}
                  className={
                    'p-0 m-0 transition-opacity delay-75 bg-transparent appearance-none cursor-pointer embla-thumbs__slide__button touch-manipulation decoration-0 px-4 py-[10px] border-[1px] border-grey-50 max-h-[85px] w-full flex items-center justify-center'
                  }
                  type="button"
                >
                  <figure>
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="object-cover object-center"
                    />
                  </figure>
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className="absolute z-10 flex items-center justify-center h-auto transform translate-x-[-50%] bg-white rounded-full cursor-pointer embla__button embla__prev w-9 aspect-square top-[2%] swiper-button image-swiperthumb-button-next shadow-base left-[50%] "
          onClick={scrollPrev}
        >
          <BlueArrowForward />
        </button>
        <button
          className="absolute z-10 flex items-center justify-center h-auto transform translate-x-[-50%] bg-white rounded-full cursor-pointer embla__button embla__next  w-9 aspect-square  swiper-button image-swiperthumb-button-next shadow-base top-[80%] left-[50%] "
          onClick={scrollNext}
        >
          <BlueArrowDown />
        </button>
      </div>
      {/* Thumbnail Carousel Ends Here */}

      {/* Main Product Image Carousel Begins Here */}
      <div className="overflow-hidden embla max-h-[532px] max-w-full  lg:max-w-[492px]">
        <div className="embla__viewport h-full" ref={emblaMainRef}>
          <div className="flex embla__container h-full">
            {images.map((image, index) => (
              <div key={index} className="min-w-0 embla__slide flex-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Product Image Carousel Ends Here */}
    </section>
  );
};

export default CarouselThumb;
