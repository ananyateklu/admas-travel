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
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            {/* Success Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2 className="text-2xl font-serif text-center mb-2">
                                Booking Confirmed!
                            </h2>

                            {/* Message */}
                            <p className="text-gray-600 text-center mb-6">
                                Your {bookingType} booking for {bookingDetails.name} has been successfully submitted.
                                {bookingDetails.reference && (
                                    <span className="block mt-2 text-sm">
                                        Booking Reference: <span className="font-medium">{bookingDetails.reference}</span>
                                    </span>
                                )}
                            </p>

                            {/* Next Steps */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <h3 className="text-sm font-medium text-blue-800 mb-2">Next Steps</h3>
                                <p className="text-sm text-blue-600">
                                    We'll send a confirmation email to {bookingDetails.email} with your booking details.
                                    Our team will contact you shortly to finalize your booking.
                                </p>
                            </div>

                            {/* Close Button */}
                            <div className="flex justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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