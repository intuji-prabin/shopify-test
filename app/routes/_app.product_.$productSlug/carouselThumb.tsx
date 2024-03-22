import useEmblaCarousel, { EmblaOptionsType } from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import { BlueArrowDown } from '~/components/icons/arrowDown';
import ArrowForward, { BlueArrowForward } from '~/components/icons/arrowForward';
import ArrowPrevious from '~/components/icons/arrowPrevious';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import AutoHeight from 'embla-carousel-auto-height';

type ImageType = {
  src: string;
  alt: string;
};

type PropType = {
  thumbNailCarouseloptions: EmblaOptionsType;
  mainCarouseloptions: EmblaOptionsType;
  images: ImageType[];
  volumePrice: boolean;
};

const CarouselThumb = ({
  thumbNailCarouseloptions,
  mainCarouseloptions,
  images,
  volumePrice
}: PropType) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(mainCarouseloptions, [AutoHeight()]);
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
    // console.log("reInit")
  }, [emblaMainApi, onSelect]);

  type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
  }

  const usePrevNextButtons = (
    emblaApi: EmblaOptionsType | undefined,
  ): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onSelect = useCallback((emblaApi: EmblaOptionsType) => {
      setPrevBtnDisabled(!emblaApi.canScrollPrev())
      setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
      if (!emblaApi) return

      onSelect(emblaApi)
      emblaApi.on('reInit', onSelect)
      emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
      prevBtnDisabled,
      nextBtnDisabled,
    }
  }

  const {
    prevBtnDisabled,
    nextBtnDisabled,
  } = usePrevNextButtons(emblaThumbsApi)

  const matches = useMediaQuery('(min-width: 1024px)');

  return (
    <div className="flex flex-col-reverse gap-y-4 gap-x-2.5 overflow-y-hidden lg:flex-row product__detSlider items-start">
      {/* Thumbnail Carousel Begins Here */}
      <div className="relative embla-thumbs w-full lg:w-[85px] lg:my-4.5">
        <div
          className="overflow-hidden embla-thumbs__viewport "
          ref={emblaThumbsRef}
        >
          <div
            className={`flex embla-thumbs__container max-h-[457px] ${matches
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
                  className={`py-2 px-1 m-0 transition-opacity delay-75 bg-transparent appearance-none cursor-pointer embla-thumbs__slide__button touch-manipulation decoration-0 lg:p-2.5 border-[1px] border-grey-50 flex items-center justify-center w-full min-w-[85px] lg:min-w-[unset] h-[85px]`}
                  type="button"
                >
                  <figure className='h-full'>
                    <img
                      src={image?.url}
                      alt={image.alt}
                      className="object-contain h-full"
                    />
                  </figure>
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          className={`absolute z-10 flex items-center justify-center h-auto transform lg:-translate-x-1/2 bg-white rounded-full cursor-pointer embla__button embla__prev w-9 aspect-square swiper-button image-swiperthumb-button-next shadow-base top-1/2 -translate-y-1/2 left-0 lg:left-[50%] lg:top-0 ${matches ? 'flex-col' : 'flex-row'
            }`}
          onClick={scrollPrev}
          disabled={prevBtnDisabled}
        >
          {matches ? <BlueArrowForward /> : <ArrowPrevious />}
        </button>
        <button
          className={`absolute z-10 flex items-center justify-center h-auto transform lg:-translate-x-1/2 bg-white rounded-full cursor-pointer embla__button embla__next w-9 aspect-square swiper-button image-swiperthumb-button-next shadow-base top-1/2 -translate-y-1/2 right-0 lg:top-full lg:left-[50%] 
         ${matches ? 'flex-col' : 'flex-row'
            }`}
          onClick={scrollNext}
          disabled={nextBtnDisabled}
        >
          {matches ? <BlueArrowDown /> : <ArrowForward fillColor={'#0092CF'} />}
        </button>
      </div>
      {/* Thumbnail Carousel Ends Here */}

      {/* Main Product Image Carousel Begins Here */}
      <div className='w-full lg:max-w-[calc(100%_-_95px)] lg:w-[unset] relative'>
        {volumePrice && (
          <div className="bg-secondary-500 px-2 py-1 text-grey-900 uppercase absolute top-0 left-0 text-base italic font-normal leading-[19px]">
            QTY Buy Available
          </div>
        )}
        <div className="embla lg:h-[532px] overflow-hidden">
          <div className="flex items-center h-full embla__viewport" ref={emblaMainRef}>
            <div className="flex h-full embla__container">
              {images.map((image: any, index: any) => (
                <div
                  key={index}
                  className="h-full min-w-0 embla__slide flex-full"
                >
                  <div className='flex items-center justify-center h-full'>
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
      </div>
      {/* Main Product Image Carousel Ends Here */}
    </div>
  );
};

export default CarouselThumb;
