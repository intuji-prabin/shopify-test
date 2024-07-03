import { ReactNode } from 'react';
interface StepsType {
  children: ReactNode;
  simple?: boolean;
  className?: string;
}

export const Steps = ({ children, simple = true, className }: StepsType) => {
  return (
    <ul
      className={`steps flex flex-col gap-y-10 md:flex-row before:content-[""] before:bg-grey-50 before:md:w-full before:md:h-0.5 before:inline-block before:absolute relative before:md:top-8 before:top-0 before:w-0.5 before:h-full before:left-1/2 before:md:left-[unset] before:z-0 ${className} ${simple ? 'justify-between before:top-[15px]' : ''
        }`}
    >
      {children}
    </ul>
  );
};
