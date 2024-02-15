import {useState} from 'react';
import {useField} from 'remix-validated-form';
import {DangerAlert} from '~/components/icons/alert';
import {EyeOff, EyeOn} from '~/components/icons/eye';

type passwordType = {
  name: string;
  placeholder: string;
  label: string;
};

export default function ValidatedFormPassword({
  name,
  placeholder,
  label,
}: passwordType) {
  const [isVisible, setVisible] = useState(false);
  const {error, getInputProps} = useField(name);

  const toggle = () => {
    setVisible(!isVisible);
  };

  return (
    <div>
      <label>
        {label}
        <span className="required">*</span>
      </label>
      <div className="relative">
        <input
          name={name}
          {...getInputProps({id: name})}
          type={!isVisible ? 'password' : 'text'}
          placeholder={placeholder}
          className="w-full !pr-14"
        />
        <span
          className="absolute -translate-y-1/2 cursor-pointer eyeIcon right-3 top-1/2"
          onClick={toggle}
        >
          {isVisible ? <EyeOn /> : <EyeOff />}
        </span>
      </div>
      {error && (
        <p className="pt-1 error-msg">
          <DangerAlert />
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
}
