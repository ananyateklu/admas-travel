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
            <motion.div
                className="flex -space-x-3 overflow-visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1,
                            delayChildren: 0.2
                        }
                    }
                }}
                initial="hidden"
                animate="visible"
            >
                {passengers.map((passenger) => (
                    <motion.div
                        key={passenger.passportNumber}
                        className="relative group/avatar"
                        variants={{
                            hidden: { scale: 0, rotate: -180 },
                            visible: { scale: 1, rotate: 0 }
                        }}
                        whileHover={{
                            scale: 1.4,
                            zIndex: 50,
                            rotate: [0, -5, 5, 0],
                            transition: { duration: 0.3 }
                        }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-400/20 to-forest-600/20 rounded-full blur-[6px] opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />

                        {/* Enhanced avatar with gradient border */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-400 to-gold p-0.5">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                <span className="text-sm font-semibold bg-gradient-to-br from-forest-700 to-gold bg-clip-text text-transparent">
                                    {passenger.fullName.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                        </div>

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
                    </motion.div>
                ))}
            </motion.div>
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