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
        w-full px-2 py-1 text-xs border rounded-lg
        ${error ? 'border-red-300' : 'border-gray-300'}
        hover:border-gray-400
        focus:outline-none focus:ring-1 focus:ring-forest-400/30 focus:border-forest-400
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
            <div className="flex items-center justify-between px-2 py-1 border-b border-gray-300">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                        <span className="text-[10px] font-medium text-forest-400">{index + 1}</span>
                    </div>
                    <h4 className="text-[10px] font-medium text-gray-700">
                        {passenger.type === 'adult' ? 'Adult' : 'Child'} Passenger
                    </h4>
                </div>
                {showAutoFill && index === 0 && onAutoFill && (
                    <motion.button
                        type="button"
                        onClick={() => onAutoFill(index)}
                        className="text-[10px] text-forest-400 hover:text-forest-400/80 transition-colors flex items-center gap-1 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <svg className="w-2.5 h-2.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Use My Information
                    </motion.button>
                )}
            </div>

            <div className="p-1.5">
                <div className="grid grid-cols-6 gap-1.5">
                    <div className="col-span-6">
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Full Name</label>
                            {getError(index, 'Name') && (
                                <span className="text-[9px] text-red-500">({getError(index, 'Name')})</span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={passenger.fullName}
                            onChange={(e) => onPassengerChange(index, 'fullName', e.target.value)}
                            className={inputClassName(getError(index, 'Name'))}
                            placeholder="As shown on passport"
                        />
                    </div>

                    <div className="col-span-3">
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Birth Date</label>
                            {getError(index, 'Birth') && (
                                <span className="text-[9px] text-red-500">({getError(index, 'Birth')})</span>
                            )}
                        </div>
                        <input
                            type="date"
                            value={passenger.dateOfBirth}
                            onChange={(e) => onPassengerChange(index, 'dateOfBirth', e.target.value)}
                            className={inputClassName(getError(index, 'Birth'))}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="col-span-3">
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Nationality</label>
                            {getError(index, 'Nationality') && (
                                <span className="text-[9px] text-red-500">({getError(index, 'Nationality')})</span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={passenger.nationality}
                            onChange={(e) => onPassengerChange(index, 'nationality', e.target.value)}
                            className={inputClassName(getError(index, 'Nationality'))}
                            placeholder="Country of citizenship"
                        />
                    </div>

                    <div className="col-span-3">
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Passport No.</label>
                            {getError(index, 'Passport') && (
                                <span className="text-[9px] text-red-500">({getError(index, 'Passport')})</span>
                            )}
                        </div>
                        <input
                            type="text"
                            value={passenger.passportNumber}
                            onChange={(e) => onPassengerChange(index, 'passportNumber', e.target.value)}
                            className={inputClassName(getError(index, 'Passport'))}
                            placeholder="Valid passport number"
                        />
                    </div>

                    <div className="col-span-3">
                        <div className="flex items-center gap-1">
                            <label className="text-[9px] font-medium text-gray-600">Passport Expiry</label>
                            {getError(index, 'Expiry') && (
                                <span className="text-[9px] text-red-500">({getError(index, 'Expiry')})</span>
                            )}
                        </div>
                        <input
                            type="date"
                            value={passenger.passportExpiry}
                            onChange={(e) => onPassengerChange(index, 'passportExpiry', e.target.value)}
                            className={inputClassName(getError(index, 'Expiry'))}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="space-y-2">
            {passengers.map((passenger, index) => renderPassengerForm(passenger, index))}
        </div>
    );
} 