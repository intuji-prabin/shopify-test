import React from 'react';
import {useField} from 'remix-validated-form';
import {DangerAlert} from '~/components/icons/alert';
import {ScheduleCallFormFieldNameType} from '~/routes/_app.support_.schedule-call/schedule-call-form';
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
    | ScheduleCallFormFieldNameType;
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
  ...props
}: InputType) => {
  const {error, getInputProps} = useField(name);

  return (
    <div>
      <label htmlFor={name}>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <div className="relative">
        <input
          {...props}
          {...getInputProps({id: name})}
          placeholder={placeholder}
          className={`${error ? 'invalid' : ''} ${
            icon ? 'with-icon' : ''
          } w-full text-grey-400`}
        />
        {icon && (
          <span className="absolute -translate-y-1/2 top-1/2 left-3">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
};
