import { motion } from 'framer-motion';

interface TripTypeSelectorProps {
    value: 'roundtrip' | 'oneway';
    onChange: (value: 'roundtrip' | 'oneway') => void;
}

export function TripTypeSelector({ value, onChange }: TripTypeSelectorProps) {
    return (
        <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Trip Type</h3>
            <div className="flex flex-col gap-2">
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
                        className="w-full px-3 py-2 rounded-lg border-2 border-transparent bg-gray-100 cursor-pointer
                            peer-checked:bg-forest-400/10 peer-checked:border-forest-400 hover:bg-gray-200 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600 peer-checked:text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            <span className="text-sm text-gray-700 peer-checked:text-gray-900 font-medium">Round Trip</span>
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
                        className="w-full px-3 py-2 rounded-lg border-2 border-transparent bg-gray-100 cursor-pointer
                            peer-checked:bg-forest-400/10 peer-checked:border-forest-400 hover:bg-gray-200 transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-600 peer-checked:text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-sm text-gray-700 peer-checked:text-gray-900 font-medium">One Way</span>
                        </div>
                    </motion.div>
                </label>
            </div>
        </div>
    );
} 