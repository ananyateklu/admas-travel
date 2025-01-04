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
        <div className="p-1.5 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-sm font-medium text-gray-700">{label}</div>
                    {helpText && <div className="text-xs text-gray-400">{helpText}</div>}
                </div>
                <div className="flex items-center gap-1">
                    <motion.button
                        type="button"
                        onClick={() => onChange(Math.max(min, value - 1))}
                        className="p-1 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        disabled={value <= min}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="w-8 text-center py-1 text-sm border border-gray-300 hover:border-gray-400 rounded-md focus:ring-1 focus:ring-gold/30 focus:border-gold focus:outline-none transition-colors"
                    />
                    <motion.button
                        type="button"
                        onClick={() => onChange(Math.min(max, value + 1))}
                        className="p-1 rounded-md border border-gray-300 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        disabled={value >= max}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </div>
    );

    const cabinOptions: { value: CabinClass; label: string; description: string }[] = [
        { value: 'economy', label: 'Economy', description: 'Standard seating' },
        { value: 'business', label: 'Business', description: 'Enhanced comfort' },
        { value: 'first', label: 'First Class', description: 'Premium experience' }
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">Passenger Count</h4>
                </div>
            </div>

            <div className="space-y-3 p-4">
                <div>
                    <h3 className="text-xs font-medium text-gray-500 mb-1.5">Passenger Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {renderCounter('Adults', adults, onAdultsChange, 1, 9, 'Age 12+')}
                        {renderCounter('Children', childCount, onChildrenChange, 0, 9, 'Age 2-11')}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-medium text-gray-500 mb-1.5">Travel Class</h3>
                    <div className="space-y-1">
                        {cabinOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${cabinClass === option.value
                                    ? 'border-gold bg-gold/5'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                onClick={() => onCabinClassChange(option.value)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">{option.label}</div>
                                        <div className="text-xs text-gray-400">{option.description}</div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${cabinClass === option.value
                                        ? 'border-gold'
                                        : 'border-gray-300'
                                        }`}>
                                        {cabinClass === option.value && (
                                            <div className="w-2 h-2 rounded-full bg-gold" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 