import React, {useState} from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import {cn} from '~/lib/utils/utils';

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const Slider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: SliderProps,
    ref,
  ) => {
    const initialValue = Array.isArray(value) ? value : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    /**
     * @description Change only if the value is between the min-max range
     * @param index
     * @param value
     */
    const handleInputChange = (index: number, value: number) => {
      if (
        (index === 0 && value >= min && value <= max) ||
        (index === 1 && value <= max)
      ) {
        const newRange = [...localValues];
        newRange[index] = value;
        setLocalValues(newRange);
      }
    };

    return (
      <div className="flex flex-col space-y-6">
        <SliderPrimitive.Root
          ref={ref as React.RefObject<HTMLDivElement>}
          min={min}
          max={max}
          step={step}
          value={localValues}
          onValueChange={handleValueChange}
          className={cn(
            'relative flex w-full touch-none select-none items-center',
            className,
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <SliderPrimitive.Range className="absolute h-full bg-primary-500" />
          </SliderPrimitive.Track>
          {localValues.map((value, index) => (
            <React.Fragment key={index}>
              <div
                className="absolute text-center"
                style={{
                  // Needs improvement in this calculation
                  left: `calc(${((value - min) / (max - min)) * 85}% + 0px)`,
                  top: `-80px`,
                }}
              >
                <span className="text-sm font-medium bg-primary-500 text-neutral-white p-1.5 rounded relative after:content-['\25bc'] after:absolute after:bottom-[-14px] after:left-[25%] after:text-primary-500">
                  {formatLabel ? formatLabel(value) : value}
                </span>
              </div>
              <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-4 border-primary-500 bg-white ring-offset-white transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300" />
            </React.Fragment>
          ))}
        </SliderPrimitive.Root>
        <div className="grid grid-cols-3 items-center">
          <input
            type="number"
            min={min}
            max={max}
            name="minPrice"
            value={localValues[0]}
            className="!border-grey-50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={(e) => handleInputChange(0, Number(e.target.value))}
          />
          <div className="flex justify-center items-center">
            <div className="w-4 h-0.5 bg-grey-50"></div>
          </div>
          <input
            type="number"
            min={min}
            max={max}
            name="maxPrice"
            value={localValues[1]}
            className="!border-grey-50 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onChange={(e) => handleInputChange(1, Number(e.target.value))}
          />
        </div>
      </div>
    );
  },
);

Slider.displayName = SliderPrimitive.Root.displayName;

export {Slider};
