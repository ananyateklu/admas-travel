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
            className="flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-xl p-1.5 relative overflow-hidden group/journey min-w-[500px] w-full border border-gray-100/50 shadow-sm"
            whileHover={{
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                transition: { duration: 0.2 }
            }}
        >
            {/* Departure */}
            <div className="flex-1 min-w-[140px]">
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
                        <p className="text-[10px] font-medium text-gray-500 ml-1">
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
                        className="px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-100"
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
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">
                            {(booking.from && typeof booking.from === 'object' ? booking.from.city : booking.from) ?? 'Unknown'}
                            {(booking.from && typeof booking.from === 'object' && 'airportCode' in booking.from) && (
                                <span className="text-forest-400 font-medium ml-1 font-mono">({booking.from.airportCode})</span>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-1 ml-[26px]">
                        <p className="text-[10px] text-gray-500 truncate max-w-[140px]">
                            {(booking.from && typeof booking.from === 'object' ? booking.from.country : '')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Duration and Path */}
            <div className="flex-none flex flex-col items-center relative px-3 min-w-[120px]">
                <div className="absolute top-[30%] left-0 right-0">
                    <div className="w-full h-[1px] bg-gradient-to-r from-gray-200/50 via-gray-300/50 to-gray-200/50" />
                    <motion.div
                        className="absolute inset-0 h-[2px]"
                        style={{
                            background: 'linear-gradient(90deg, rgba(234,179,8,0.1) 0%, rgba(234,179,8,0.3) 50%, rgba(234,179,8,0.1) 100%)'
                        }}
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <motion.div
                        className="absolute h-1 w-1 rounded-full bg-gold/40 top-1/2 -translate-y-1/2"
                        animate={{
                            x: ['0%', '100%'],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>
                <motion.div
                    className="bg-white rounded-full px-2 py-0.5 shadow-sm border border-gray-100 z-10"
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
            <div className="flex-1 min-w-[140px]">
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
                        <p className="text-[10px] font-medium text-gray-500 ml-1">
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
                        className="px-1.5 py-0.5 rounded-full bg-gray-50 border border-gray-100"
                        whileHover={{ scale: 1.05 }}
                    >
                        <p className="text-[10px] font-medium text-gray-500">
                            {booking.returnDate ? new Date(booking.returnDate).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric'
                            }) : ''}
                        </p>
                    </motion.div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-gray-800 truncate max-w-[140px]">
                            {(booking.to && typeof booking.to === 'object' ? booking.to.city : booking.to) ?? 'Unknown'}
                            {(booking.to && typeof booking.to === 'object' && 'airportCode' in booking.to) && (
                                <span className="text-forest-400 font-medium ml-1 font-mono">({booking.to.airportCode})</span>
                            )}
                        </p>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-[2px]" />
                            <div className="relative p-1 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-full border border-emerald-500/20">
                                <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" transform="rotate(180 12 12)" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 mr-[26px]">
                        <p className="text-[10px] text-gray-500 truncate max-w-[140px]">
                            {(booking.to && typeof booking.to === 'object' ? booking.to.country : '')}
                        </p>
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