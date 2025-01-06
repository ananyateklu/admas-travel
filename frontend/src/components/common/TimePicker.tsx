import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerProps {
    label?: string;
    value: string;
    onChange: (time: string) => void;
    required?: boolean;
    className?: string;
}

export function TimePicker({
    label,
    value,
    onChange,
    required = false,
    className = ''
}: TimePickerProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const timeSlots = Array.from({ length: 24 * 2 }).map((_, index) => {
        const hour = Math.floor(index / 2);
        const minute = (index % 2) * 30;
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    });

    const handleTimeSelect = (time: string) => {
        onChange(time);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    aria-required={required}
                    className={`w-full pl-10 pr-8 py-1.5 text-xs text-gray-900 bg-white border rounded-lg text-left
                        ${isFocused ? 'border-primary ring-1 ring-primary/20' : 'border-gray-300'}
                        focus:outline-none transition-all duration-200 ${className}`}
                >
                    {value || 'Select time'}
                </button>
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
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-auto"
                    >
                        {timeSlots.map((time) => (
                            <motion.button
                                key={time}
                                type="button"
                                onClick={() => handleTimeSelect(time)}
                                className={`w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors
                                    ${time === value ? 'bg-primary/10 text-primary' : 'text-gray-700'}`}
                                whileHover={{ backgroundColor: 'rgb(249, 250, 251)' }}
                            >
                                {time}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
} 