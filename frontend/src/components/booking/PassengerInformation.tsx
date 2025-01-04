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
    errors?: Record<string, string>;
}

export function PassengerInformation({
    passengers,
    onPassengerChange,
    onAutoFill,
    showAutoFill = false,
    errors = {}
}: PassengerInformationProps) {
    const getError = (index: number, field: string) => {
        return errors[`passenger${index}${field}`];
    };

    const inputClassName = (error: string | undefined) => `
        w-full px-3 py-2 text-sm border rounded-lg
        ${error ? 'border-red-300' : 'border-gray-300'}
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-gold/30 focus:border-gold
        disabled:bg-gray-50 disabled:text-gray-500
        placeholder:text-gray-400
        transition-all duration-200
    `;

    const renderPassengerForm = (passenger: PassengerInfo, index: number) => (
        <motion.div
            key={`${passenger.type}-${index}`}
            className="bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-300">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-gold">{index + 1}</span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700">
                        {passenger.type === 'adult' ? 'Adult' : 'Child'} Passenger
                    </h4>
                </div>
                {showAutoFill && index === 0 && onAutoFill && (
                    <motion.button
                        type="button"
                        onClick={() => onAutoFill(index)}
                        className="text-xs text-gold hover:text-gold/80 transition-colors flex items-center gap-1 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg className="w-3 h-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Use My Information
                    </motion.button>
                )}
            </div>

            <div className="p-4 grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={passenger.fullName}
                        onChange={(e) => onPassengerChange(index, 'fullName', e.target.value)}
                        className={inputClassName(getError(index, 'Name'))}
                        placeholder="As shown on passport"
                    />
                    {getError(index, 'Name') && (
                        <p className="mt-1.5 text-xs text-red-500">{getError(index, 'Name')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={passenger.dateOfBirth}
                        onChange={(e) => onPassengerChange(index, 'dateOfBirth', e.target.value)}
                        className={inputClassName(getError(index, 'Birth'))}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {getError(index, 'Birth') && (
                        <p className="mt-1.5 text-xs text-red-500">{getError(index, 'Birth')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Nationality
                    </label>
                    <input
                        type="text"
                        value={passenger.nationality}
                        onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                        className={inputClassName(getError(index, 'Nationality'))}
                        placeholder="Country of citizenship"
                    />
                    {getError(index, 'Nationality') && (
                        <p className="mt-1.5 text-xs text-red-500">{getError(index, 'Nationality')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Passport Number
                    </label>
                    <input
                        type="text"
                        value={passenger.passportNumber}
                        onChange={(e) => onPassengerChange(index, 'passportNumber', e.target.value)}
                        className={inputClassName(getError(index, 'Passport'))}
                        placeholder="Valid passport number"
                    />
                    {getError(index, 'Passport') && (
                        <p className="mt-1.5 text-xs text-red-500">{getError(index, 'Passport')}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Passport Expiry Date
                    </label>
                    <input
                        type="date"
                        value={passenger.passportExpiry}
                        onChange={(e) => onPassengerChange(index, 'passportExpiry', e.target.value)}
                        className={inputClassName(getError(index, 'Expiry'))}
                        min={new Date().toISOString().split('T')[0]}
                    />
                    {getError(index, 'Expiry') && (
                        <p className="mt-1.5 text-xs text-red-500">{getError(index, 'Expiry')}</p>
                    )}
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-4">
            {passengers.map((passenger, index) => renderPassengerForm(passenger, index))}
        </div>
    );
} 