import React, {useEffect, useState} from 'react';

interface CircularProgressProps {
  percentage?: number;
  setIsProgressBarShow: React.Dispatch<React.SetStateAction<boolean>>;
}
export function CircularProgressBar({
  percentage = 100,
  setIsProgressBarShow,
}: CircularProgressProps) {
  const [dashoffset, setDashoffset] = useState<number>(400);
  const [percentageIndicator, setPercentageIndicator] = useState<number>(0);

  /**
   * @description Dashoffset represents the strokeDashoffset of the progress circle
   *              useEffect is responsible for animating the progress bar when the percentage prop changes.
   *              It calculates the dashoffset based on the percentage and updates it over time.
   */
  useEffect(() => {
    const initialDashoffset = 400;
    const targetDashoffset = 400 - (400 * percentage) / 100;

    setDashoffset(initialDashoffset);

    const dashOffSetInterval = setInterval(() => {
      setDashoffset((prevDashoffset) => {
        const newDashoffset = prevDashoffset - 4; // Adjust the decrement value for speed
        return newDashoffset < targetDashoffset
          ? targetDashoffset
          : newDashoffset;
      });
    }, 30);
    const percentagesInterval = setInterval(() => {
      setPercentageIndicator((previousValue) =>
        previousValue < 100 ? previousValue + 1 : previousValue,
      );
    }, 25);

    return () => {
      clearInterval(dashOffSetInterval);
      clearInterval(percentagesInterval);
    };
  }, [percentage]);

  useEffect(() => {
    if (percentageIndicator === 100) {
      setIsProgressBarShow(false);
    }
  }, [percentageIndicator, setIsProgressBarShow]);

  return (
    <div className="relative h-20 w-20">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="stroke-current text-gray-200"
          strokeWidth="8"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>
        {/* Progress circle */}
        <circle
          className="progress-ring__circle stroke-current text-primary-500"
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDashoffset={dashoffset}
        ></circle>

        {/* Center text */}

        <text
          x="50"
          y="50"
          fontFamily="Verdana"
          fontSize="12"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {percentageIndicator}%
        </text>
      </svg>
    </div>
  );
}
