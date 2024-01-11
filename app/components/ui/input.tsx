import React from 'react';
import {useField} from 'remix-validated-form';
import {DangerAlert} from '~/components/icons/alert';
import {LoginFormFieldNameType} from '~/routes/_public.login/login-form';
import {OrderFilterFormFieldNameType} from '~/routes/order/filter-form';
import {ScheduleCallFormFieldNameType} from '~/routes/support_.schedule-call/schedule-call-form';
import {TeamFormFieldNameType} from '~/routes/team_.add-team/team-form';

interface InputType extends React.ComponentPropsWithoutRef<'input'> {
  name:
    | TeamFormFieldNameType
    | LoginFormFieldNameType
    | OrderFilterFormFieldNameType
    | ScheduleCallFormFieldNameType;
  label: string;
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
