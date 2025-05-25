import { motion } from 'framer-motion';
import { BookingData, FlightBookingData } from '../types';

interface JourneyDetailsProps {
    booking: BookingData;
}

// Add type guard function
function isFlightBooking(booking: BookingData): booking is FlightBookingData {
    return 'departureTime' in booking;
}

export function JourneyDetails({ booking }: JourneyDetailsProps) {
    if (!isFlightBooking(booking)) return null;

    return (
        <motion.div
            className="flex items-center gap-2 bg-gradient-to-r from-white/50 via-white/60 to-white/50 backdrop-blur-sm rounded-xl p-2 relative overflow-hidden group/journey w-full border border-gray-200/60 shadow-sm hover:shadow-md"
            whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                borderColor: "rgba(156, 163, 175, 0.4)",
                transition: { duration: 0.2 }
            }}
        >
            {/* Departure */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 whitespace-nowrap mb-1.5">
                    <div className="flex items-baseline">
                        <p className="text-base font-bold text-gray-900 tracking-tight font-mono">
                            {booking.departureTime ?
                                new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })
                                : '--:--'
                            }
                        </p>
                        <p className="hidden sm:block text-[11px] font-semibold text-gray-500 ml-1.5">
                            {booking.departureTime ?
                                new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                    hour12: true,
                                    hour: undefined,
                                    minute: undefined
                                }).split(' ')[1]
                                : ''
                            }
                        </p>
                    </div>
                    <motion.div
                        className="hidden lg:block px-2 py-1 rounded-full bg-gradient-to-r from-gray-50 to-gray-100/80 border border-gray-200/60 shadow-sm"
                        whileHover={{ scale: 1.05, y: -1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="text-[11px] font-semibold text-gray-600">
                            {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gold/15 rounded-full blur-[3px]" />
                            <div className="relative p-1.5 bg-gradient-to-br from-gold/25 to-gold/10 rounded-full border border-gold/30 shadow-sm">
                                <svg className="w-3.5 h-3.5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                            {(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'}
                            {(booking.from && typeof booking.from === 'object' && 'airportCode' in booking.from) && (
                                <span className="text-forest-500 font-bold ml-1 font-mono tracking-wider">({booking.from.airportCode})</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Line */}
            <div className="flex-shrink-0 w-24 sm:w-32 lg:w-36 relative flex items-center justify-center">
                {/* Animated flight path */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-0">
                    <svg className="w-full h-2" viewBox="0 0 100 2">
                        <motion.path
                            d="M 0 1 Q 50 0 100 1"
                            stroke="url(#flightGradient)"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            fill="none"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <defs>
                            <linearGradient id="flightGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#D4AF37" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Animated plane icon */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover/journey:opacity-100"
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                    </motion.div>
                </div>

                <motion.div
                    className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm border border-gray-200/60 z-10 hidden sm:block relative"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center justify-center gap-1.5">
                        <span className="text-[11px] font-semibold text-gray-800 whitespace-nowrap capitalize tracking-wide">
                            {booking.class}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex-shrink-0 shadow-sm" />
                        <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap tracking-wide">
                            {booking.tripType === 'oneway' ? 'One Way' : 'Round Trip'}
                        </span>
                    </div>
                </motion.div>

                {/* Mobile version */}
                <motion.div
                    className="sm:hidden bg-white/95 backdrop-blur-sm rounded-lg px-2 py-1.5 shadow-sm border border-gray-200/60 z-10 relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex flex-col items-center gap-0.5">
                        <span className="text-[10px] font-semibold text-gray-800 capitalize tracking-wide">
                            {booking.class}
                        </span>
                        <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
                        <span className="text-[9px] font-medium text-gray-600 tracking-wide">
                            {booking.tripType === 'oneway' ? 'One Way' : 'Round'}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Arrival */}
            <div className="flex-1 min-w-0 max-w-[35%] flex flex-col items-end">
                <div className="flex items-baseline gap-1.5 justify-end whitespace-nowrap mb-1.5">
                    <motion.div
                        className="hidden lg:block px-2 py-1 rounded-full bg-gradient-to-r from-gray-50 to-gray-100/80 border border-gray-200/60 shadow-sm"
                        whileHover={{ scale: 1.05, y: -1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="text-[11px] font-semibold text-gray-600">
                            {new Date(booking.returnDate ?? booking.departureDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                    <div className="flex items-baseline">
                        <p className="text-base font-bold text-gray-900 tracking-tight font-mono">
                            {booking.returnTime ?
                                new Date(`2000-01-01T${booking.returnTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })
                                : '--:--'
                            }
                        </p>
                        <p className="hidden sm:block text-[11px] font-semibold text-gray-500 ml-1.5">
                            {booking.returnTime ?
                                new Date(`2000-01-01T${booking.returnTime}`).toLocaleTimeString(undefined, {
                                    hour12: true,
                                    hour: undefined,
                                    minute: undefined
                                }).split(' ')[1]
                                : ''
                            }
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 justify-end">
                        <p className="text-xs font-semibold text-gray-800 truncate text-right">
                            {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}
                            {(booking.to && typeof booking.to === 'object' && 'airportCode' in booking.to) && (
                                <span className="text-forest-500 font-bold ml-1 font-mono tracking-wider">({booking.to.airportCode})</span>
                            )}
                        </p>
                        <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-forest-400/15 rounded-full blur-[3px]" />
                            <div className="relative p-1.5 bg-gradient-to-br from-forest-400/25 to-forest-400/10 rounded-full border border-forest-400/30 shadow-sm">
                                <svg className="w-3.5 h-3.5 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(180 12 12)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/journey:opacity-100 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />

            {/* Subtle glow effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-forest-400/5 opacity-0 group-hover/journey:opacity-100 rounded-xl blur-sm"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            />
        </motion.div>
    );
} 