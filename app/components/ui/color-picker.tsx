import { X } from 'lucide-react';
import { useState } from 'react';
import { HexAlphaColorPicker } from 'react-colorful';

type ColorPickerProps = {
    name: string;
    color: string;
    onChange: (color: string) => void;
};

const ColorPicker = ({ name, color, onChange }: ColorPickerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="flex items-center gap-3">
                <p className="text-lg font-medium">Hex</p>
                <button type="button"
                    className="flex items-center gap-3 p-2 border border-solid cursor-pointer border-grey-50"
                    onClick={() => setIsOpen(true)}
                >
                    <div style={{ backgroundColor: color }} className="border border-solid w-7 h-7 border-grey-50"></div>
                    <p className='font-normal'>{color}</p>
                </button>
                <input
                    type="hidden"
                    value={color}
                    name={name}
                    style={{ backgroundColor: color }}
                    onClick={() => setIsOpen(true)}
                />
            </div>
            {isOpen && (
                <>
                    <button className='fixed inset-0 cursor-default' onClick={() => setIsOpen(false)}></button>
                    <div className="absolute p-4 bg-white rounded-lg shadow-lg w-min">
                        <div className="flex justify-between">
                            <h5>Color Picker</h5>
                            <button type='button' onClick={() => setIsOpen(false)}>
                                <X className="cursor-pointer text-grey-500" />
                            </button>
                        </div>
                        <HexAlphaColorPicker color={color} onChange={onChange} />
                    </div>
                </>
            )}
        </>
    );
};

export default ColorPicker;
