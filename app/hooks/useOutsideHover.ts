import {useEffect, useRef} from 'react';

type UseOutsideHoverProps = {
  handleOutsideHover: () => void;
  condition: boolean;
};

const useOutsideHover = ({
  handleOutsideHover,
  condition,
}: UseOutsideHoverProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseLeave = () => {
      handleOutsideHover();
    };

    if (condition && targetRef.current) {
      targetRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (targetRef.current) {
        targetRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handleOutsideHover]);

  return {targetRef};
};

export default useOutsideHover;