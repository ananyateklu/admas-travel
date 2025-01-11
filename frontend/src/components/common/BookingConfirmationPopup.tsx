import { motion, AnimatePresence } from 'framer-motion';

interface BookingConfirmationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    bookingType: 'flight' | 'hotel';
    bookingDetails: {
        name: string;
        reference?: string;
        email: string;
    };
}

export function BookingConfirmationPopup({
    isOpen,
    onClose,
    bookingType,
    bookingDetails
}: BookingConfirmationPopupProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-40"
                        onClick={onClose}
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
                            {/* Success Banner */}
                            <div className="bg-forest-400/10 rounded-t-lg p-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-[13px] font-medium text-gray-900">Booking Confirmed</h2>
                                        <p className="text-[11px] text-gray-500">Your {bookingType} has been successfully booked</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Booking Details */}
                                <div className="space-y-3">
                                    {/* Flight Route */}
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[11px] text-gray-500">Flight Route</div>
                                            <div className="text-[12px] font-medium text-gray-900 flex items-center gap-1.5">
                                                <span>{bookingDetails.name.split(' to ')[0]}</span>
                                                <svg className="w-3 h-3 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                                <span>{bookingDetails.name.split(' to ')[1]}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {bookingDetails.reference && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-[11px] text-gray-500">Booking Reference</div>
                                                <div className="text-[12px] font-medium text-gray-900">{bookingDetails.reference}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[11px] text-gray-500">Contact Email</div>
                                            <div className="text-[12px] font-medium text-gray-900">{bookingDetails.email}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Steps Card */}
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-4 h-4 rounded-full bg-forest-400/10 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-[11px] font-medium text-gray-900">Next Steps</h3>
                                            <p className="text-[10px] text-gray-500">What happens next</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                            <p className="text-[11px] text-gray-600">Confirmation email will be sent to your inbox</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                            <p className="text-[11px] text-gray-600">Our team will review and process your booking</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-forest-400/60"></div>
                                            <p className="text-[11px] text-gray-600">You'll receive final confirmation within 24 hours</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="w-full px-4 py-2 bg-forest-400 text-white rounded-lg hover:bg-forest-400/90 transition-colors text-[11px] font-medium"
                                >
                                    Close
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 