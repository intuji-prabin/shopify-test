import React from 'react';
import {useField} from 'remix-validated-form';
import {DangerAlert} from '~/components/icons/alert';
import {CreateTicketFormFieldNameType} from '~/routes/_app.support_.create-ticket/create-ticket-form';
import {
  AddTeamFormFieldNameType,
  EditTeamFormFieldNameType,
} from '~/routes/_app.team_.add/team-form';
import {LoginFormFieldNameType} from '~/routes/_public.login/login-form';

interface InputType extends React.ComponentPropsWithoutRef<'input'> {
  name:
    | AddTeamFormFieldNameType
    | EditTeamFormFieldNameType
    | LoginFormFieldNameType
    | CreateTicketFormFieldNameType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  icon?: any;
}

export const Input = ({
  name,
  label,
  placeholder,
  required,
  icon,
  disabled,
  ...props
}: InputType) => {
  const {error, getInputProps} = useField(name);

  return (
    <div>
      <label htmlFor={name} className={`${disabled && 'text-grey-200'}`}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          {...getInputProps({id: name})}
          disabled={disabled}
          placeholder={placeholder}
          className={`${error ? 'invalid' : ''} ${
            icon ? 'with-icon' : ''
          } w-full text-grey-400 disabled:bg-grey-25 disabled:!border-grey-25 disabled:border disabled:opacity-50`}
        />
        {icon && (
          <span className="absolute -translate-y-1/2 top-1/2 left-3">
            {icon}
          </span>
        )}
      </div>
      {!disabled && error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
};
