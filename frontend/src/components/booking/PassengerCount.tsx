import React from 'react';
import { motion } from 'framer-motion';

type CabinClass = 'economy' | 'business' | 'first';

interface PassengerCountProps {
    adults: number;
    childCount: number;
    onAdultsChange: (count: number) => void;
    onChildrenChange: (count: number) => void;
    cabinClass: CabinClass;
    onCabinClassChange: (value: CabinClass) => void;
}

export function PassengerCount({
    adults,
    childCount,
    onAdultsChange,
    onChildrenChange,
    cabinClass,
    onCabinClassChange
}: PassengerCountProps) {
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        (e.target as HTMLElement).blur();
    };

    const renderCounter = (
        label: string,
        value: number,
        onChange: (value: number) => void,
        min: number,
        max: number,
        helpText?: string
    ) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {helpText && (
                <label className="block text-xs text-gray-400 mb-0.5">{helpText}</label>
            )}
            <div className="flex items-center">
                <motion.button
                    type="button"
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    disabled={value <= min}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                </motion.button>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        if (!isNaN(newValue)) {
                            onChange(Math.min(Math.max(min, newValue), max));
                        }
                    }}
                    onWheel={handleWheel}
                    min={min}
                    max={max}
                    className="w-16 text-center mx-2 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
                <motion.button
                    type="button"
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    disabled={value >= max}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </motion.button>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {renderCounter('Adults', adults, onAdultsChange, 1, 9, 'Age 12+')}
            {renderCounter('Children', childCount, onChildrenChange, 0, 9, 'Age 2-11')}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Class
                </label>
                <label className="block text-xs text-gray-400 mb-0.5">Travel Class</label>
                <select
                    value={cabinClass}
                    onChange={(e) => onCabinClassChange(e.target.value as CabinClass)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                </select>
            </div>
        </div>
    );
} 