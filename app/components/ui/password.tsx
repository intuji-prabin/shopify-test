import {Eye, EyeOff} from 'lucide-react';
import {useState} from 'react';

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
          name={name}
          type={!isVisible ? 'password' : 'text'}
          placeholder={placeholder}
          className="w-full !pr-14"
        />
        <span
          className="absolute -translate-y-1/2 cursor-pointer eyeIcon right-3 top-1/2"
          onClick={toggle}
        >
          {isVisible ? <Eye /> : <EyeOff />}
        </span>
      </div>
    </div>
  );
}
