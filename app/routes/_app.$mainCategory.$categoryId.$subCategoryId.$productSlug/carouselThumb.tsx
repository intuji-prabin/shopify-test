import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import React, { useCallback, useEffect, useState } from 'react';
import ArrowDown, { BlueArrowDown } from '~/components/icons/arrowDown';
import ArrowForward, { BlueArrowForward } from '~/components/icons/arrowForward';
import { LeftBlueArrow } from '~/components/icons/left';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { ArrowLeft } from 'lucide-react';
import ArrowPrevious from '~/components/icons/arrowPrevious';
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
  const matches = useMediaQuery('(min-width: 1024px)');
  return (
    <section className="flex flex-col-reverse gap-[17px] overflow-y-hidden lg:flex-row product__detSlider">
      {/* Thumbnail Carousel Begins Here */}
      <div className="relative  embla-thumbs  lg:min-w-[85px] overflow-y-hidden">
        <div
          className="overflow-hidden embla-thumbs__viewport "
          ref={emblaThumbsRef}
        >
          <div
            className={`flex embla-thumbs__container ${matches
              ? 'flex-col gap-y-2'
              : 'flex-row gap-x-2 max-h-[unset]'
              }`}
          >
            {images.map((image: any, index: any) => (
              <div
                key={index}
                className={`embla__slide flex justify-center items-center  ${matches ? 'flex-col' : 'flex-row'
                  }`}
              >
                <button
                  onClick={() => onThumbClick(index)}
                  className={`p-0 m-0 transition-opacity delay-75 bg-transparent appearance-none cursor-pointer embla-thumbs__slide__button touch-manipulation decoration-0 lg:px-4 lg:py-[10px] border-[1px] border-grey-50  w-full flex items-center justify-center `}
                  type="button"
                >
                  <figure>
                    <img
                      src={image?.url}
                      alt={image.alt}
                      className="object-center"
                    />
                  </figure>
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className={`absolute z-10 flex items-center justify-center h-auto transform lg:translate-x-[-50%] bg-white rounded-full cursor-pointer embla__button embla__prev w-9 aspect-square  swiper-button image-swiperthumb-button-next shadow-base top-1/2 translate-x-0 -translate-y-1/2 left-0 lg:left-[50%] lg:top-[2%] ${matches ? 'flex-col' : 'flex-row'
            }`}
          onClick={scrollPrev}
        >
          {matches ? <BlueArrowForward /> : <ArrowPrevious />}
        </button>
        <button
          className={`absolute z-10 flex items-center justify-center h-auto transform translate-x-[-50%] bg-white rounded-full cursor-pointer embla__button embla__next  w-9 aspect-square  swiper-button image-swiperthumb-button-next shadow-base top-1/2 -translate-y-1/2 right-0  lg:top-[92%] lg:left-[50%] lg:-translate-y-0 ${matches ? 'flex-col' : 'flex-row'
            }`}
          onClick={scrollNext}
        >
          {matches ? <BlueArrowDown /> : <ArrowForward fillColor={'#0092CF'} />}
        </button>
      </div>
      {/* Thumbnail Carousel Ends Here */}

      {/* Main Product Image Carousel Begins Here */}
      <div className="overflow-hidden embla max-h-[532px] max-w-full  lg:max-w-[492px]">
        <div className="h-full embla__viewport" ref={emblaMainRef}>
          <div className="flex h-full embla__container">
            {images.map((image: any, index: any) => (
              <div
                key={index}
                className="h-full min-w-0 embla__slide flex-full"
              >
                <div className='flex items-center justify-center'>
                  <img
                    src={image?.url}
                    alt={image.alt}
                    className="object-contain"
                  />
                </div>
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
