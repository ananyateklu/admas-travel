import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';
import { TermsAndConditionsModal } from '../common/TermsAndConditionsModal';

interface BookingFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests?: string;
    agreeToTerms: boolean;
}

interface CarBookingModalProps {
    car: CarSearchResult;
    onClose: () => void;
    onConfirm: (formData: BookingFormData) => Promise<void>;
    isLoading?: boolean;
}

export function CarBookingModal({
    car,
    onClose,
    onConfirm,
    isLoading = false
}: CarBookingModalProps) {
    const [formData, setFormData] = useState<BookingFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        await onConfirm(formData);
    };

    const formatPrice = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key="modal-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ zIndex: 99999 }}
                    className="fixed inset-0 bg-black/50 overflow-y-auto"
                    onClick={onClose}
                >
                    <div className="min-h-screen w-full flex items-center justify-center p-4">
                        <motion.div
                            key="modal-content"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={{
                                hidden: { opacity: 0, scale: 0.95, y: 20 },
                                visible: { opacity: 1, scale: 1, y: 0 },
                                exit: { opacity: 0, scale: 0.95, y: 20 }
                            }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="w-[95%] md:w-[70%] lg:w-[55%] xl:w-[50%] min-w-[800px] max-w-[1200px] bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden"
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

                            {/* Car Summary Section */}
                            <div className="relative flex items-center justify-between p-5 border-b">
                                <div className="flex-1">
                                    <h2 className="text-xl font-serif mb-1 text-gray-900">{car.vehicle_info.name}</h2>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            {car.vehicle_info.type} • {car.vehicle_info.category}
                                        </p>
                                        <p className="text-base font-bold text-primary">
                                            {formatPrice(car.pricing.total_price.amount, car.pricing.total_price.currency)}
                                            <span className="text-xs font-normal text-gray-500 ml-1">total • Includes taxes and fees</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="w-48 h-32 ml-6 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={car.vehicle_info.image_url}
                                        alt={car.vehicle_info.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            {/* Booking Form */}
                            <div className="p-5">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                                required
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                                required
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="specialRequests" className="block text-xs font-medium text-gray-700 mb-1">
                                            Special Requests (Optional)
                                        </label>
                                        <textarea
                                            id="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                                            rows={3}
                                            className="block w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-primary/30 focus:border-primary"
                                        />
                                    </div>

                                    <div className="flex items-start pt-2">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                id="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <label htmlFor="agreeToTerms" className="text-xs text-gray-600">
                                                I agree to the{' '}
                                                <button
                                                    type="button"
                                                    className="text-primary hover:text-primary-dark underline"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsTermsModalOpen(true);
                                                    }}
                                                >
                                                    terms and conditions
                                                </button>
                                            </label>
                                            {errors.agreeToTerms && (
                                                <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                                        >
                                            {isLoading ? 'Processing...' : 'Confirm Booking'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <TermsAndConditionsModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />
        </>
    );
} 