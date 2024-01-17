import * as React from 'react';
import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '~/lib/utils/utils';

const buttonVariants = cva(
  'cursor-pointer duration-150 flex items-center justify-center gap-2 uppercase p-2 border-solid',
  {
    variants: {
      variant: {
        primary:
          'text-neutral-white bg-primary-500 hover:bg-primary-600 disabled:bg-grey-50',
        ghost:
          'text-grey-900 border border-primary-500 hover:bg-primary-100 disabled:border-none disabled:text-neutral-white disabled:bg-grey-50',
        link: 'relative before:absolute before:w-full before:h-0.5 before:bg-primary-500 before:-bottom-1 p-0 before:hover:bg-primary-600 before:duration-150 disabled:text-grey-50 disabled:before:bg-grey-50',
        danger: 'bg-semantic-danger-100 border border-semantic-danger-500',
        input: 'text-grey-500 border border-grey-100 not-italic',
      },
      size: {
        default: 'px-6 py-2 text-sm leading-6',
        small: 'px-4 py-1.5 text-sm leading-4',
        large: 'px-8 py-4 text-lg leading-6',
        medium: 'px-3 py-2',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export {Button, buttonVariants};
