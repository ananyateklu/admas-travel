import { useState, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
    label?: string;
    selected: Date;
    onChange: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    required?: boolean;
    className?: string;
}

export function DatePicker({
    label,
    selected,
    onChange,
    minDate,
    maxDate,
    required = false,
    className = ''
}: DatePickerProps) {
    const [isFocused, setIsFocused] = useState(false);

    const CustomInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void }>(
        ({ value, onClick }, ref) => (
            <input
                ref={ref}
                value={value}
                onClick={onClick}
                readOnly
                className={`w-full pl-10 pr-8 py-1.5 text-xs text-gray-900 bg-white border rounded-lg
                    ${isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-gray-300'}
                    focus:outline-none transition-all duration-200 ${className}`}
            />
        )
    );

    CustomInput.displayName = 'DatePickerInput';

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <ReactDatePicker
                    selected={selected}
                    onChange={onChange}
                    minDate={minDate}
                    maxDate={maxDate}
                    required={required}
                    dateFormat="MMM d, yyyy"
                    customInput={<CustomInput />}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="text-gray-900"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className={`w-4 h-4 ${isFocused ? 'text-primary' : 'text-gray-400'} transition-colors`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
} 