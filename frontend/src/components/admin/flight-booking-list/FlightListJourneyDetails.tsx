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
            className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-xl p-1.5 relative overflow-hidden group/journey w-full border border-gray-100/50 shadow-sm"
            whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                transition: { duration: 0.2 }
            }}
        >
            {/* Departure */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 whitespace-nowrap mb-1">
                    <div className="flex items-baseline">
                        <p className="text-sm font-bold text-gray-900 tracking-tight font-mono">
                            {booking.departureTime ?
                                new Date(`2000-01-01T${booking.departureTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })
                                : '--:--'
                            }
                        </p>
                        <p className="hidden sm:block text-[10px] font-medium text-gray-500 ml-1">
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
                        className="hidden sm:block px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-100"
                        whileHover={{ scale: 1.05 }}
                    >
                        <p className="text-[10px] font-medium text-gray-500">
                            {new Date(booking.departureDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gold/10 rounded-full blur-[2px]" />
                            <div className="relative p-1 bg-gradient-to-br from-gold/20 to-gold/5 rounded-full border border-gold/20">
                                <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-gray-800 truncate">
                            {(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'}
                            {(booking.from && typeof booking.from === 'object' && 'airportCode' in booking.from) && (
                                <span className="text-forest-400 font-medium ml-1 font-mono">({booking.from.airportCode})</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Connection Line */}
            <div className="flex-shrink-0 w-16 sm:w-24 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <div className="absolute w-2 h-2 rounded-full bg-gray-300" />
                </div>
                <motion.div
                    className="bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 z-10 hidden sm:block"
                    whileHover={{ y: -2, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-900 whitespace-nowrap capitalize">
                            {booking.class}
                        </span>
                        <span className="h-2 w-px bg-gradient-to-b from-gray-200/50 to-transparent" />
                        <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
                            {booking.tripType === 'oneway' ? 'One Way' : 'Round Trip'}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Arrival */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 justify-end whitespace-nowrap mb-1">
                    <div className="flex items-baseline">
                        <p className="text-sm font-bold text-gray-900 tracking-tight font-mono">
                            {booking.returnTime ?
                                new Date(`2000-01-01T${booking.returnTime}`).toLocaleTimeString(undefined, {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })
                                : '--:--'
                            }
                        </p>
                        <p className="hidden sm:block text-[10px] font-medium text-gray-500 ml-1">
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
                    <motion.div
                        className="hidden sm:block px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-100"
                        whileHover={{ scale: 1.05 }}
                    >
                        <p className="text-[10px] font-medium text-gray-500">
                            {new Date(booking.returnDate ?? booking.departureDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            })}
                        </p>
                    </motion.div>
                </div>
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 justify-end">
                        <p className="text-xs font-medium text-gray-800 truncate">
                            {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}
                            {(booking.to && typeof booking.to === 'object' && 'airportCode' in booking.to) && (
                                <span className="text-forest-400 font-medium ml-1 font-mono">({booking.to.airportCode})</span>
                            )}
                        </p>
                        <div className="relative">
                            <div className="absolute inset-0 bg-forest-400/10 rounded-full blur-[2px]" />
                            <div className="relative p-1 bg-gradient-to-br from-forest-400/20 to-forest-400/5 rounded-full border border-forest-400/20">
                                <svg className="w-3 h-3 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(180 12 12)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hover Effect Overlay */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover/journey:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
} 