import { motion } from 'framer-motion';

interface Passenger {
    fullName: string;
    type: 'adult' | 'child';
    nationality: string;
    passportNumber: string;
}

interface PassengerAvatarsProps {
    passengers: Passenger[];
}

export function PassengerAvatars({ passengers }: PassengerAvatarsProps) {
    return (
        <motion.div
            className="flex flex-col items-end gap-2 overflow-visible"
            whileHover={{ scale: 1.02 }}
        >
            <div className="flex -space-x-3 overflow-visible">
                {passengers.map((passenger, index) => (
                    <motion.div
                        key={passenger.passportNumber}
                        className="relative group/avatar"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: index * 0.1 }
                        }}
                        whileHover={{
                            scale: 1.35,
                            zIndex: 50,
                            transition: { type: "spring", stiffness: 400, damping: 10 }
                        }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-400/20 to-forest-600/20 rounded-full blur-[6px] opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />

                        {/* Avatar */}
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-forest-50/90 to-forest-100/80 border-2 border-forest-200/30 shadow-md backdrop-blur-sm flex items-center justify-center transform transition-all duration-300 group-hover/avatar:shadow-xl group-hover/avatar:border-forest-300/50">
                            <span className="text-sm font-semibold bg-gradient-to-br from-forest-700 to-forest-600 bg-clip-text text-transparent transition-all duration-300">
                                {passenger.fullName.split(' ').map(n => n[0]).join('')}
                            </span>

                            {/* Type Indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5">
                                <div className={`relative px-1 py-0.5 rounded-full text-[9px] font-medium shadow-sm backdrop-blur-sm border
                                    ${passenger.type === 'adult'
                                        ? 'bg-blue-50/90 text-blue-700 border-blue-200/50'
                                        : 'bg-green-50/90 text-green-700 border-green-200/50'
                                    }`}
                                >
                                    {passenger.type === 'adult' ? 'A' : 'C'}
                                </div>
                            </div>
                        </div>

                        {/* Hover Card */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/avatar:opacity-100 transition-all duration-200 pointer-events-none z-[60]">
                            <div className="bg-white/90 rounded-xl shadow-xl p-2.5 whitespace-nowrap border border-gray-100/50 text-xs backdrop-blur-sm">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-gray-900">{passenger.fullName}</div>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium backdrop-blur-sm
                                        ${passenger.type === 'adult'
                                            ? 'bg-blue-50/90 text-blue-700 border border-blue-200/30'
                                            : 'bg-green-50/90 text-green-700 border border-green-200/30'
                                        }`}
                                    >
                                        {passenger.type === 'adult' ? 'Adult' : 'Child'}
                                    </span>
                                </div>
                                <div className="text-gray-500 text-[10px] mt-0.5">{passenger.nationality}</div>
                                <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-gray-200/50">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-gray-500">Passport:</span>
                                        <span className="text-[10px] font-medium text-gray-900 font-mono tracking-wide">{passenger.passportNumber}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/90 border-b border-r border-gray-100/50 transform rotate-45 backdrop-blur-sm"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
            {passengers.length > 1 && (
                <motion.span
                    className="text-[10px] font-medium text-gray-500 bg-gray-50/80 px-1.5 py-0.5 rounded-full border border-gray-100/50 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {passengers.length} Passengers
                </motion.span>
            )}
        </motion.div>
    );
} 