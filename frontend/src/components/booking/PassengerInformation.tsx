import { motion } from 'framer-motion';

interface PassengerInfo {
    type: 'adult' | 'child';
    fullName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    nationality: string;
}

interface PassengerInformationProps {
    passengers: PassengerInfo[];
    onPassengerChange: (index: number, field: keyof PassengerInfo, value: string) => void;
    onAutoFill?: (index: number) => void;
    showAutoFill?: boolean;
}

export function PassengerInformation({
    passengers,
    onPassengerChange,
    onAutoFill,
    showAutoFill = false
}: PassengerInformationProps) {
    const renderPassengerForm = (passenger: PassengerInfo, index: number) => (
        <motion.div
            key={`${passenger.type}-${index}`}
            className="mb-8 p-6 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium">
                    {passenger.type === 'adult' ? 'Adult' : 'Child'} Passenger {index + 1}
                </h4>
                {showAutoFill && index === 0 && onAutoFill && (
                    <motion.button
                        type="button"
                        onClick={() => onAutoFill(index)}
                        className="text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Use My Information
                    </motion.button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={passenger.fullName}
                        onChange={(e) => onPassengerChange(index, 'fullName', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        placeholder="As shown on passport"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => onPassengerChange(index, 'dateOfBirth', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality
                    </label>
                    <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        placeholder="Country of citizenship"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Number
                    </label>
                    <input
                        type="text"
                        value={passenger.passportNumber}
                        onChange={(e) => onPassengerChange(index, 'passportNumber', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                        required
                        placeholder="Valid passport number"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Passport Expiry Date
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={passenger.passportExpiry}
                            onChange={(e) => onPassengerChange(index, 'passportExpiry', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                        Must be valid for at least 6 months beyond your planned stay
                    </p>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Passenger Information</h3>
            {passengers.map((passenger, index) => renderPassengerForm(passenger, index))}
        </div>
    );
} 