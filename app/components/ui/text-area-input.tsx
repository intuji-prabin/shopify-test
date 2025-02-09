import React from 'react';
import { useField } from 'remix-validated-form';
import { DangerAlert } from '../icons/alert';
import { CreateTicketFormFieldNameType } from '~/routes/_app.support_.create-ticket/create-ticket-form';

type TextAreaInputType = {
  name: CreateTicketFormFieldNameType;
  label: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
};

export function TextAreaInput({
  name,
  label,
  placeholder,
  required,
  icon,
  ...props
}: TextAreaInputType) {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="relative">
        <textarea
          {...props}
          {...getInputProps({ id: name, onChange: (e) => console.log("e", e.target.value) })}
          rows={8}
          placeholder={placeholder}
          className={`${error ? 'invalid' : ''} ${icon ? 'with-icon' : ''
            } w-full text-grey-400`}
        ></textarea>
        {icon && (
          <span className="absolute -translate-y-1/2 top-1/2 left-3">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="py-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
}
