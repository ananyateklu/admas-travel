import { motion, AnimatePresence } from 'framer-motion';

interface TermsAndConditionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsAndConditionsModal({ isOpen, onClose }: TermsAndConditionsModalProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ zIndex: 100000 }}
                className="fixed inset-0 bg-black/50 overflow-y-auto"
                onClick={onClose}
            >
                <div className="min-h-screen w-full flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-[95%] max-w-3xl bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-500 transition-colors bg-white/80 backdrop-blur-sm rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Header */}
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-serif text-gray-900">Terms and Conditions</h2>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <section className="space-y-2">
                                <h3 className="text-base font-medium text-gray-900">1. Booking and Payment</h3>
                                <p className="text-sm text-gray-600">
                                    By making a reservation, you agree to pay the total amount specified at the time of booking. All payments must be made through our secure payment system.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-medium text-gray-900">2. Cancellation Policy</h3>
                                <p className="text-sm text-gray-600">
                                    Cancellations made at least 24 hours before the pickup time will receive a full refund. Late cancellations or no-shows may be subject to charges.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-medium text-gray-900">3. Driver Requirements</h3>
                                <p className="text-sm text-gray-600">
                                    Drivers must be at least 21 years old and possess a valid driver's license. Additional fees may apply for drivers under 25.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-medium text-gray-900">4. Insurance</h3>
                                <p className="text-sm text-gray-600">
                                    Basic insurance is included in the rental price. Additional coverage options are available at the time of pickup.
                                </p>
                            </section>

                            <section className="space-y-2">
                                <h3 className="text-base font-medium text-gray-900">5. Vehicle Usage</h3>
                                <p className="text-sm text-gray-600">
                                    Vehicles must be used in accordance with local laws and regulations. Off-road driving is prohibited unless specifically permitted.
                                </p>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t bg-gray-50">
                            <p className="text-xs text-gray-500 text-center">
                                Last updated: January 2024
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
} 