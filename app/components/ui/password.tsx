import {useState} from 'react';
import {EyeOff, EyeOn} from '~/components/icons/eye';

type passwordType = {
  name: string;
  placeholder: string;
  handlePasswordChange?: (event: any) => void;
  label: string;
};

export default function Password({
  name,
  placeholder,
  handlePasswordChange,
  label,
}: passwordType) {
  const [isVisible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };

  return (
    <div>
      <label>{label}</label>
      <div className="relative">
        <input
          type={!isVisible ? 'password' : 'text'}
          name={name}
          placeholder={placeholder}
          onChange={handlePasswordChange}
          className="w-full !pr-14"
        />
        <span
          className="absolute -translate-y-1/2 cursor-pointer eyeIcon right-3 top-1/2"
          onClick={toggle}
        >
          {isVisible ? <EyeOn /> : <EyeOff />}
        </span>
      </div>
    </div>
  );
}
