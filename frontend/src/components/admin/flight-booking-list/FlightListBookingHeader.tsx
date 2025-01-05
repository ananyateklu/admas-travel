import { motion } from 'framer-motion';
import { StatusBadge } from './FlightListStatusBadge';
import { BookingMetaBadge } from './FlightListBookingMetaBadge';

interface BookingHeaderProps {
    contactName: string;
    status: string;
    bookingReference: string;
    createdAt: Date | { toDate: () => Date };
    rating?: {
        score: number;
    };
}

export function BookingHeader({
    contactName,
    status,
    bookingReference,
    createdAt,
    rating
}: BookingHeaderProps) {
    return (
        <div className="flex items-center gap-2">
            <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-forest-400/20 to-forest-600/20 rounded-xl blur-[6px]" />
                <div className="relative w-7 h-7 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest-50 to-forest-100/80 border border-forest-200/30 shadow-sm backdrop-blur-sm">
                    <span className="text-xs font-semibold bg-gradient-to-br from-forest-700 to-forest-600 bg-clip-text text-transparent">
                        {contactName.charAt(0).toUpperCase()}
                    </span>
                </div>
            </motion.div>

            <div>
                <motion.h3
                    className="text-sm font-semibold text-gray-900 flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <span>{contactName}</span>
                    {rating && (
                        <motion.div
                            className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full text-[10px] font-medium bg-amber-50/80 text-amber-700 border border-amber-200/50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-2.5 h-2.5" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span>{rating.score.toFixed(1)}</span>
                        </motion.div>
                    )}
                </motion.h3>

                <div className="flex items-center gap-1 mt-0.5">
                    <StatusBadge status={status} />

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <BookingMetaBadge
                            icon={
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                </svg>
                            }
                            label="Ref"
                            value={bookingReference}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <BookingMetaBadge
                            icon={
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            }
                            label="Created"
                            value={(typeof createdAt === 'object' && 'toDate' in createdAt
                                ? createdAt.toDate()
                                : new Date(createdAt)
                            ).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 