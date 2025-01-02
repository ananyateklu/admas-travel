import { motion } from 'framer-motion';

interface TripTypeSelectorProps {
    value: 'roundtrip' | 'oneway';
    onChange: (value: 'roundtrip' | 'oneway') => void;
}

export function TripTypeSelector({ value, onChange }: TripTypeSelectorProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Trip Type</h3>
            <div className="flex gap-4">
                <label className="relative flex items-center group">
                    <input
                        type="radio"
                        name="tripType"
                        value="roundtrip"
                        checked={value === 'roundtrip'}
                        onChange={(e) => onChange(e.target.value as 'roundtrip' | 'oneway')}
                        className="sr-only peer"
                    />
                    <motion.div
                        className="px-4 py-2 rounded-lg border-2 border-transparent bg-gray-100 cursor-pointer
                            peer-checked:bg-gold/10 peer-checked:border-gold hover:bg-gray-200 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600 peer-checked:text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-gray-700 peer-checked:text-gray-900 font-medium">Round Trip</span>
                        </div>
                    </motion.div>
                </label>

                <label className="relative flex items-center group">
                    <input
                        type="radio"
                        name="tripType"
                        value="oneway"
                        checked={value === 'oneway'}
                        onChange={(e) => onChange(e.target.value as 'roundtrip' | 'oneway')}
                        className="sr-only peer"
                    />
                    <motion.div
                        className="px-4 py-2 rounded-lg border-2 border-transparent bg-gray-100 cursor-pointer
                            peer-checked:bg-gold/10 peer-checked:border-gold hover:bg-gray-200 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-600 peer-checked:text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-gray-700 peer-checked:text-gray-900 font-medium">One Way</span>
                        </div>
                    </motion.div>
                </label>
            </div>
        </div>
    );
} 