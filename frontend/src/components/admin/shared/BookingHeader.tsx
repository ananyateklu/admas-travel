import { motion } from 'framer-motion';
import { StatusBadge } from '../flight-booking-list/FlightListStatusBadge';
import { BookingMetaBadge } from '../flight-booking-list/FlightListBookingMetaBadge';

interface BaseBookingHeaderProps {
    status: string;
    createdAt: Date | { toDate: () => Date };
}

interface FlightBookingHeaderProps extends BaseBookingHeaderProps {
    type: 'flight';
    contactName: string;
    bookingReference: string;
    rating?: {
        score: number;
    };
}

interface HotelBookingHeaderProps extends BaseBookingHeaderProps {
    type: 'hotel';
    guestName: string;
    hotelName: string;
    bookingId: string;
    rating?: {
        score: number;
    };
}

interface CarBookingHeaderProps extends BaseBookingHeaderProps {
    type: 'car';
    renterName: string;
    vehicleInfo?: {
        name?: string;
        type?: string;
    };
    bookingId: string;
}

type BookingHeaderProps = FlightBookingHeaderProps | HotelBookingHeaderProps | CarBookingHeaderProps;

export function BookingHeader(props: BookingHeaderProps) {
    const getName = () => {
        switch (props.type) {
            case 'flight':
                return props.contactName;
            case 'hotel':
                return props.guestName;
            case 'car':
                return props.renterName;
        }
    };

    const getReference = () => {
        switch (props.type) {
            case 'flight':
                return props.bookingReference;
            case 'hotel':
            case 'car':
                return props.bookingId;
        }
    };

    const getSubtitle = () => {
        switch (props.type) {
            case 'flight':
                return null;
            case 'hotel':
                return props.hotelName;
            case 'car': {
                if (!props.vehicleInfo) return null;
                const vehicleName = props.vehicleInfo.name ?? 'Unknown Vehicle';
                const vehicleType = props.vehicleInfo.type ?? 'Unknown Type';
                return `${vehicleName} • ${vehicleType}`;
            }
        }
    };

    const name = getName();
    const reference = getReference();
    const subtitle = getSubtitle();

    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-2">
            <div className="flex items-start gap-2">
                <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-forest-400/20 to-forest-600/20 rounded-xl blur-[6px]" />
                    <div className="relative w-7 h-7 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest-50 to-forest-100/80 border border-forest-200/30 shadow-sm backdrop-blur-sm">
                        <span className="text-xs font-semibold bg-gradient-to-br from-forest-700 to-forest-600 bg-clip-text text-transparent">
                            {name?.charAt(0).toUpperCase() ?? 'U'}
                        </span>
                    </div>
                </motion.div>

                <div className="min-w-0 flex-1">
                    <motion.h3
                        className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 truncate"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="truncate">{name}</span>
                        {'rating' in props && props.rating && (
                            <motion.div
                                className="inline-flex flex-shrink-0 items-center gap-0.5 px-1 py-0.5 rounded-full text-[10px] font-medium bg-amber-50/80 text-amber-700 border border-amber-200/50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <svg className="w-2.5 h-2.5" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                <span>{props.rating.score.toFixed(1)}</span>
                            </motion.div>
                        )}
                    </motion.h3>

                    {subtitle && (
                        <motion.p
                            className="text-xs text-gray-500 truncate"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    <div className="hidden sm:flex items-center gap-1 mt-1">
                        <StatusBadge status={props.status} />
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
                                value={reference}
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
                                value={(typeof props.createdAt === 'object' && 'toDate' in props.createdAt
                                    ? props.createdAt.toDate()
                                    : new Date(props.createdAt)
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

            {/* Mobile-only status and metadata */}
            <div className="flex flex-col items-start gap-2 sm:hidden">
                <StatusBadge status={props.status} />
                <div className="flex flex-col items-start gap-1">
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
                            value={reference}
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
                            value={(typeof props.createdAt === 'object' && 'toDate' in props.createdAt
                                ? props.createdAt.toDate()
                                : new Date(props.createdAt)
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