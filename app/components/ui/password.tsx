import {Eye, EyeOff} from 'lucide-react';
import {useState} from 'react';

type passwordType = {
  name: string;
  placeholder: string;
  handlePasswordChange?: (event: any) => void;
};

export default function Password({
  name,
  placeholder,
  handlePasswordChange,
}: passwordType) {
  const [isVisible, setVisible] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };

  return (
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
        {isVisible ? <Eye /> : <EyeOff />}
      </span>
    </div>
  );
}
