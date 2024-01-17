import React, { HTMLProps } from 'react';
import { useField } from 'remix-validated-form';
import { cn } from '~/lib/utils/utils';
import { LoginFormFieldNameType } from '~/routes/_public.login/login-form';

interface CheckboxInputType extends React.ComponentPropsWithoutRef<'input'> {
  name: LoginFormFieldNameType;
  className?: HTMLProps<HTMLElement>['className'];
  label: string;
}

export default function CheckboxInput({
  name,
  label,
  className,
}: CheckboxInputType) {
  const { getInputProps } = useField(name);
  return (
    <div className={cn(className, 'flex items-baseline space-x-1')}>
      <input type="checkbox" {...getInputProps({ id: name })} />
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
