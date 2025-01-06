import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarSearchResult } from '../../types/carSearch';

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
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (formData: BookingFormData) => Promise<void>;
    isLoading?: boolean;
}

export function CarBookingModal({
    car,
    isOpen,
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
                            {/* Header */}
                            <div className="px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-medium text-gray-900">
                                        Complete Your Booking
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                                {/* Car Summary */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={car.vehicle_info.image_url}
                                            alt={car.vehicle_info.name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {car.vehicle_info.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {car.vehicle_info.category} • {car.vehicle_info.transmission}
                                            </p>
                                            <p className="text-lg font-bold text-gray-900 mt-2">
                                                {formatPrice(car.pricing.total_price.amount, car.pricing.total_price.currency)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Form */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                                required
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                                required
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                            required
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                            required
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
                                            Special Requests (Optional)
                                        </label>
                                        <textarea
                                            id="specialRequests"
                                            value={formData.specialRequests}
                                            onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                                            rows={3}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>

                                    <div className="flex items-start">
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
                                            <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                                                I agree to the terms and conditions
                                            </label>
                                            {errors.agreeToTerms && (
                                                <p className="mt-1 text-xs text-red-500">{errors.agreeToTerms}</p>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Price</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatPrice(car.pricing.total_price.amount, car.pricing.total_price.currency)}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            type="submit"
                                            onClick={handleSubmit}
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Processing...</span>
                                                </div>
                                            ) : (
                                                'Confirm Booking'
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
} 