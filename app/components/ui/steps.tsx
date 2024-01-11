import { ReactNode } from 'react';
interface StepsType {
    children: ReactNode;
    simple?: boolean;
    className?: string;
}

export const Steps = ({ children, simple = true, className }: StepsType) => {
    return (
        <ul className={`steps flex before:content-[""] before:bg-grey-25 before:w-full before:h-0.5 before:inline-block before:absolute relative before:top-8 before:-z-10 ${className} ${simple ? "justify-between before:top-[15px]" : ""}`}>
            {children}
        </ul>
    );
}